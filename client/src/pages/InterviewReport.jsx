import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../config";
import Step3Report from "../components/Step3Report";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function InterviewReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    const fetchReport = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/report/" + id,
          { withCredentials: true },
        );

        if (isActive) setReport(result.data);
      } catch (error) {
        console.log(error);
        if (isActive) {
          setLoadError(
            error.response?.data?.message ||
              "This interview report could not be loaded.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchReport();
    return () => {
      isActive = false;
    };
  }, [id, attempt]);

  if (isLoading || loadError) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
          {isLoading ? (
            <p role="status" className="text-slate-600">
              Loading interview report...
            </p>
          ) : (
            <>
              <h1 className="text-3xl text-slate-900">Report unavailable</h1>
              <p role="alert" className="mt-3 text-slate-600">
                {loadError}
              </p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setLoadError("");
                  setAttempt((current) => current + 1);
                }}
                className="mt-6 rounded-md bg-brand-red px-5 py-3 font-semibold text-white hover:bg-red-700"
              >
                Try again
              </button>
            </>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return <Step3Report report={report} />;
}

export default InterviewReport;
