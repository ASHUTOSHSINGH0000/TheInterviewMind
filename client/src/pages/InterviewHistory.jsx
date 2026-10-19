import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../config";
import { FaArrowLeft, FaChartLine } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/get-interview",
          { withCredentials: true },
        );
        setInterviews(result.data);
      } catch (error) {
        console.log(error);
        setLoadError(
          "Interview history could not be loaded. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 flex items-start gap-4 flex-wrap">
            <button
              onClick={() => navigate("/")}
              aria-label="Back to home"
              className="mt-1 flex h-10 w-10 items-center justify-center border border-slate-200 bg-white transition hover:border-red-500"
            >
              <FaArrowLeft className="text-slate-600" />
            </button>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-medium">
                Progress
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Interview history
              </h1>
              <p className="text-slate-500 mt-2">
                Review completed sessions, scores, and question-level feedback.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div
              role="status"
              className="border-y border-slate-200 py-12 text-center text-slate-600"
            >
              Loading interview history...
            </div>
          ) : loadError ? (
            <div
              role="alert"
              className="border border-red-200 bg-red-50 p-5 text-sm text-red-800"
            >
              {loadError}
            </div>
          ) : interviews.length === 0 ? (
            <div className="border-y border-slate-200 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <FaChartLine size={22} />
              </div>
              <h2 className="text-2xl text-slate-900">No interviews yet</h2>
              <p className="mx-auto mt-2 max-w-md text-slate-600">
                Your completed and in-progress sessions will appear here.
              </p>
              <button
                onClick={() => navigate("/interview")}
                className="mt-6 rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Start an interview
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {interviews.map((item) => (
                <article
                  key={item._id}
                  className="flex flex-col gap-4 bg-white py-5 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      {item.mode} interview
                    </p>
                    <h2 className="mt-1 truncate text-xl text-slate-900">
                      {item.role || "Interview session"}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                      <span>{item.experience}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="sm:text-right">
                      {item.status?.toLowerCase() === "completed" &&
                      item.finalScore != null ? (
                        <>
                          <p className="text-xl font-semibold text-slate-900">
                            {item.finalScore}/10
                          </p>
                          <p className="text-xs text-slate-500">
                            Overall score
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">No score yet</p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        item.status?.toLowerCase() === "completed" &&
                        navigate(`/report/${item._id}`)
                      }
                      disabled={item.status?.toLowerCase() !== "completed"}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {item.status?.toLowerCase() === "completed"
                        ? "View report"
                        : "In progress"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default InterviewHistory;
