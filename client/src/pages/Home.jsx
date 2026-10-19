import React from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
  BsShieldCheck,
  BsGraphUpArrow,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthModel from "../components/AuthModel";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      icon: <BsRobot size={22} />,
      step: "STEP 01",
      title: "Set your interview context",
      desc: "Choose a role, experience level, and technical or HR interview mode. Add a resume if you want role context.",
    },
    {
      icon: <BsMic size={22} />,
      step: "STEP 02",
      title: "Practice with AI",
      desc: "Work through five generated questions using voice input or the answer field, with a timer for each question.",
    },
    {
      icon: <BsBarChart size={22} />,
      step: "STEP 03",
      title: "Review insights",
      desc: "Review answer feedback and the score breakdown, then revisit completed interviews from your history.",
    },
  ];

  const features = [
    {
      image: evalImg,
      icon: <BsBarChart size={20} />,
      title: "Answer feedback",
      desc: "See feedback after each submitted answer and a final score across confidence, communication, and correctness.",
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume-based context",
      desc: "Tailor questions to your background so every mock interview feels job-specific.",
    },
    {
      image: pdfImg,
      icon: <BsShieldCheck size={20} />,
      title: "Downloadable reports",
      desc: "Export polished PDF summaries to track wins, gaps, and improvements over time.",
    },
    {
      image: analyticsImg,
      icon: <BsGraphUpArrow size={20} />,
      title: "Interview history",
      desc: "Return to completed interviews to review their scores and question-level feedback.",
    },
  ];

  const modes = [
    {
      img: hrImg,
      title: "HR interview mode",
      desc: "Generate a five-question HR interview using your role and experience as context.",
    },
    {
      img: techImg,
      title: "Technical interview mode",
      desc: "Generate a five-question technical interview using your role and experience as context.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <section className="grid items-center gap-8 border-b border-slate-200 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <HiSparkles size={16} /> A calmer way to prepare
              </p>
              {userData?.name && (
                <p className="mb-3 text-sm text-slate-600">
                  Welcome back, {userData.name}.
                </p>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="max-w-xl text-4xl leading-[1.04] text-slate-900 sm:text-6xl lg:text-7xl"
              >
                Make the next interview feel familiar.
              </motion.h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Practice with questions shaped around your role and experience.
                Answer by voice or text, then review the feedback and score
                breakdown.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    navigate("/interview");
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Start an interview <BsArrowRight size={17} />
                </button>
                <button
                  onClick={() => navigate(userData ? "/history" : "/pricing")}
                  className="px-2 py-3 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-emerald-700"
                >
                  {userData ? "Review interview history" : "View credit plans"}
                </button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-5 text-xs font-medium uppercase text-slate-500">
                <span>Role-specific questions</span>
                <span>Voice or text answers</span>
                <span>Question-level feedback</span>
              </div>
            </div>
            <div className="relative flex min-h-64 items-center justify-center bg-slate-100 p-5 sm:min-h-80 lg:min-h-[420px]">
              <img
                src={hrImg}
                alt="Candidate practicing a video interview"
                className="max-h-[360px] w-full object-contain"
              />
              <div className="absolute bottom-4 left-4 border-l-2 border-emerald-600 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm sm:bottom-7 sm:left-7">
                Five questions. One focused practice session.
              </div>
            </div>
          </section>

          <section className="mt-16">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-medium">
                How it works
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
                A practical three-step prep loop
              </h2>
            </div>
            <div className="grid gap-x-8 md:grid-cols-3">
              {steps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-t border-slate-300 py-5"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center text-emerald-700">
                    {item.icon}
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="mb-10">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-medium">
                Platform features
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
                Everything needed to interview with confidence
              </h2>
            </div>

            <div className="grid gap-x-10 lg:grid-cols-2">
              {features.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="border-t border-slate-300 py-5"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-slate-100 sm:h-28 sm:w-28">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="mb-3 text-emerald-700">{item.icon}</div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-medium">
                Interview modes
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
                Technical and HR practice
              </h2>
            </div>

            <div className="grid max-w-4xl gap-x-10 md:grid-cols-2">
              {modes.map((mode, index) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="border-t border-slate-300 py-5"
                >
                  <div className="mb-4 flex h-48 items-center justify-center bg-slate-100 p-3">
                    <img
                      src={mode.img}
                      alt={mode.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {mode.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {mode.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-20 rounded-[32px] border border-slate-200 bg-slate-900 px-6 py-10 sm:px-10 lg:px-12 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
                  Ready to start
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em]">
                  Train for your next opportunity with confidence.
                </h2>
              </div>

              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                className="inline-flex items-center gap-2 bg-white text-slate-900 rounded-full px-6 py-3.5 font-medium hover:bg-slate-100 transition"
              >
                Launch interview <BsArrowRight size={18} />
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Home;
