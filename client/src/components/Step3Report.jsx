import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-lg">Loading report...</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Strong interview readiness.";
    shortTagline = "Excellent clarity, structure, and confidence.";
  } else if (finalScore >= 5) {
    performanceText = "Solid foundation with room to sharpen.";
    shortTagline = "Good baseline; focus on delivery and depth.";
  } else {
    performanceText = "Needs more practice before the next round.";
    shortTagline = "Prioritize structure, clarity, and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(240, 0, 47);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;
    doc.setDrawColor(240, 0, 47);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;
    doc.setFillColor(255, 240, 242);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });

    currentY += 30;
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    let advice = "";
    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain your confidence and continue refining your examples to strengthen your answers.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation. Focus on tighter structure, clearer examples, and a calmer delivery under pressure.";
    } else {
      advice =
        "Significant improvement is needed. Practice in shorter, more structured formats and keep your answers confident and specific.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 55;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [240, 0, 47],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full flex items-start gap-4 flex-wrap">
              <button
                onClick={() => navigate("/history")}
                className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition border border-slate-200"
              >
                <FaArrowLeft className="text-slate-600" />
              </button>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-medium">
                  Results
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Interview analytics dashboard
                </h1>
                <p className="text-slate-500 mt-2">
                  AI-powered performance insights
                </p>
              </div>
            </div>

            <button
              onClick={downloadPDF}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 font-medium"
            >
              Download PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[28px] shadow-[0_18px_44px_rgba(15,23,42,0.05)] border border-slate-200 p-6 text-center"
              >
                <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  Overall performance
                </h3>
                <div className="relative w-28 h-28 mx-auto mt-6">
                  <CircularProgressbar
                    value={percentage}
                    text={`${score}/10`}
                    styles={buildStyles({
                      textSize: "18px",
                      pathColor: "#F0002F",
                      textColor: "#151313",
                      trailColor: "#E4E4E6",
                    })}
                  />
                </div>

                <p className="text-sm text-slate-500 mt-4">Out of 10</p>
                <div className="mt-5">
                  <p className="font-semibold text-slate-900">
                    {performanceText}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">{shortTagline}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[28px] shadow-[0_18px_44px_rgba(15,23,42,0.05)] border border-slate-200 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-5">
                  Skill evaluation
                </h3>

                <div className="space-y-5">
                  {skills.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-slate-700">{s.label}</span>
                        <span className="font-semibold text-emerald-600">
                          {s.value}
                        </span>
                      </div>
                      <div className="bg-slate-200 h-2.5 rounded-full">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${s.value * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[28px] shadow-[0_18px_44px_rgba(15,23,42,0.05)] border border-slate-200 p-5 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-5">
                  Performance trend
                </h3>

                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={questionScoreData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E6" />
                      <XAxis dataKey="name" stroke="#9A9A9F" />
                      <YAxis domain={[0, 10]} stroke="#9A9A9F" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#F0002F"
                        fill="#FFE0E5"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[28px] shadow-[0_18px_44px_rgba(15,23,42,0.05)] border border-slate-200 p-5 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Question breakdown
                </h3>

                <div className="space-y-6">
                  {questionWiseScore.map((q, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 border border-slate-200 rounded-[22px] p-4 sm:p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                            Question {i + 1}
                          </p>
                          <p className="font-semibold text-slate-800 text-base leading-relaxed mt-2">
                            {q.question || "Question not available"}
                          </p>
                        </div>

                        <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-semibold text-sm w-fit">
                          {q.score ?? 0}/10
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-emerald-700 font-medium mb-2">
                          AI feedback
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {q.feedback && q.feedback.trim() !== ""
                            ? q.feedback
                            : "No feedback available for this question."}
                        </p>
                      </div>
                      {q.answer && (
                        <div className="mt-3 border border-slate-200 bg-white p-4">
                          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                            Your answer
                          </p>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Step3Report;
