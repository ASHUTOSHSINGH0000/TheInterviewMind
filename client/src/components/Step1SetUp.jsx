import React from "react";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { ServerUrl } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [resumeError, setResumeError] = useState("");

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setResumeError("");
    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );

      setRole((prevRole) =>
        prevRole && prevRole.trim() !== "" ? prevRole : result.data.role || "",
      );
      setExperience((prevExp) =>
        prevExp && prevExp.trim() !== ""
          ? prevExp
          : result.data.experience || "",
      );
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setResumeError(
        error.response?.data?.message ||
          "Resume analysis failed. Please try another PDF.",
      );
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    if (userData && userData.credits < 50) {
      setSetupError(
        `Not enough credits. Minimum 50 credits required to start an interview (Your balance: ${userData.credits || 0}).`,
      );
      return;
    }
    setSetupError("");
    setLoading(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      const msg =
        error.response?.data?.message ||
        "Failed to start interview. Please try again.";
      setSetupError(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50 px-4 py-10"
    >
      <div className="w-full max-w-6xl bg-white rounded-[32px] shadow-[0_35px_80px_rgba(15,23,42,0.10)] grid md:grid-cols-2 overflow-hidden border border-slate-200">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-slate-900 p-8 text-white sm:p-10 lg:p-12 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 border-l-2 border-emerald-500 pl-3 py-1.5 text-red-200 text-xs font-medium uppercase w-fit">
            <FaCheckCircle size={12} />
            Smart interview prep
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl text-white leading-tight">
            A little practice makes a real difference.
          </h2>

          <p className="mt-4 text-slate-200 leading-relaxed">
            Practice real interview scenarios powered by AI, sharpen your
            responses, and turn each round into measurable improvement.
          </p>

          <div className="mt-8 space-y-4">
            {[
              {
                icon: <FaUserTie className="text-red-600 text-xl" />,
                text: "Choose role and experience profile",
              },
              {
                icon: <FaMicrophoneAlt className="text-red-600 text-xl" />,
                text: "Run a realistic voice-based interview",
              },
              {
                icon: <FaChartLine className="text-red-600 text-xl" />,
                text: "Review AI-driven feedback and scorecards",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.15 }}
                className="flex items-center gap-4 border-b border-white/15 py-4"
              >
                <div className="flex h-12 w-12 items-center justify-center bg-white">
                  {item.icon}
                </div>
                <span className="text-white font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-6 sm:p-8 lg:p-10 bg-white"
        >
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Interview setup
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add your context and begin preparing.
            </p>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <label
                htmlFor="interview-role"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Role
              </label>
              <FaUserTie className="absolute left-4 top-[calc(50%+0.5rem)] -translate-y-1/2 text-slate-400" />
              <input
                id="interview-role"
                type="text"
                required
                aria-required="true"
                autoComplete="organization-title"
                placeholder="e.g. Product designer"
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition bg-slate-50"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            <div className="relative">
              <label
                htmlFor="interview-experience"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Experience
              </label>
              <FaBriefcase className="absolute left-4 top-[calc(50%+0.5rem)] -translate-y-1/2 text-slate-400" />
              <input
                id="interview-experience"
                type="text"
                required
                aria-required="true"
                placeholder="e.g. 2 years"
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition bg-slate-50"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            <label
              htmlFor="interview-mode"
              className="block text-sm font-semibold text-slate-700"
            >
              Interview type
            </label>
            <select
              id="interview-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full py-3.5 px-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition bg-slate-50 text-slate-700"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="border border-dashed border-slate-300 p-5 text-center transition hover:border-red-500 hover:bg-red-50"
              >
                <FaFileUpload className="text-4xl mx-auto text-emerald-600 mb-3" />

                <label
                  htmlFor="resumeUpload"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  Resume PDF (optional)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="mx-auto block max-w-full text-sm text-slate-600 file:mr-3 file:border-0 file:bg-slate-200 file:px-3 file:py-2"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                {resumeFile && (
                  <p className="mt-2 text-sm text-slate-600">
                    Selected: {resumeFile.name}
                  </p>
                )}

                {resumeFile && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    disabled={analyzing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-4 bg-slate-900 text-white px-5 py-2.5 hover:bg-slate-800 transition disabled:opacity-60"
                  >
                    {analyzing ? "Analyzing..." : "Analyze resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4"
              >
                <h3 className="text-lg font-semibold text-slate-800">
                  Resume analysis result
                </h3>

                {projects.length > 0 && (
                  <div>
                    <p className="font-medium text-slate-700 mb-2">Projects</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-medium text-slate-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {resumeError && (
              <p
                role="alert"
                className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {resumeError}
              </p>
            )}

            {setupError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                {setupError}
              </div>
            )}

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full disabled:bg-slate-400 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-md text-base font-semibold transition duration-300"
            >
              {loading ? "Starting..." : "Start interview"}
            </motion.button>
            <p className="text-xs text-slate-500">
              Role and experience are required. Starting an interview uses 50
              credits.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;
