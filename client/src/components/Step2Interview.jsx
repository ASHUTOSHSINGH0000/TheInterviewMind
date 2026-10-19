import React from "react";
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState, useRef, useEffect, useEffectEvent } from "react";
import axios from "axios";
import { ServerUrl } from "../config";
import { BsArrowRight } from "react-icons/bs";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const isMicOnRef = useRef(isMicOn);
  const isAIPlayingRef = useRef(isAIPlaying);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [micError, setMicError] = useState(() =>
    typeof window !== "undefined" &&
    !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
      ? "Speech recognition is not available in this browser. You can still type your answer."
      : "",
  );
  const [submitError, setSubmitError] = useState("");
  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
      if (!englishVoices.length) return;

      const googleVoice = englishVoices.find((v) =>
        v.name.toLowerCase().includes("google us english"),
      );
      if (googleVoice) {
        setSelectedVoice(googleVoice);
        setVoiceGender("female");
        return;
      }

      const naturalVoice = englishVoices.find(
        (v) =>
          v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("neural") ||
          v.name.toLowerCase().includes("aria") ||
          v.name.toLowerCase().includes("guy"),
      );
      if (naturalVoice) {
        setSelectedVoice(naturalVoice);
        setVoiceGender(
          naturalVoice.name.toLowerCase().includes("guy") ? "male" : "female",
        );
        return;
      }

      const femaleVoice = englishVoices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );
      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = englishVoices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );
      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(englishVoices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function startMic() {
    if (!recognitionRef.current) {
      setMicError(
        "Speech recognition is not available. You can still type your answer.",
      );
      return;
    }
    if (!isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error(error);
      }
    }
  }

  function stopMic() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        if (videoRef.current) {
          try {
            videoRef.current.play();
          } catch (error) {
            console.error(error);
          }
        }
      };

      utterance.onend = () => {
        if (videoRef.current) {
          try {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          } catch (error) {
            console.error(error);
          }
        }
        setIsAIPlaying(false);
        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  const runInterviewVoice = useEffectEvent(async () => {
    if (isIntroPhase) {
      await speakText(
        `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
      );
      await speakText(
        "I'll ask a few questions. Just answer naturally and take your time. Let's begin.",
      );
      setIsIntroPhase(false);
    } else if (currentQuestion) {
      await new Promise((r) => setTimeout(r, 800));
      if (currentIndex === questions.length - 1) {
        await speakText("Alright, this one might be a bit more challenging.");
      }
      await speakText(currentQuestion.question);
      if (isMicOn) {
        startMic();
      }
    }
  });

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      await runInterviewVoice();
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, currentQuestion]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setMicError("");
    };

    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + " ";
      }
      setAnswer(fullTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "not-allowed") {
        setMicError(
          "Microphone permission blocked. Please check the lock icon in your browser URL bar to enable access.",
        );
      } else if (event.error === "network") {
        setMicError(
          "Network error. Speech recognition requires an active internet connection.",
        );
      }
    };

    recognition.onend = () => {
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.error(error);
        }
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (isMicOn) stopMic();
    else startMic();
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    setSubmitError("");
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setSubmitError(
        error.response?.data?.message ||
          "Your answer could not be submitted. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  const submitAnswerOnTimeout = useEffectEvent(() => submitAnswer());

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setTimeLeft(questions[currentIndex + 1]?.timeLimit || 60);
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true },
      );
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      const timeout = setTimeout(() => submitAnswerOnTimeout(), 0);
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, isIntroPhase, currentQuestion, isSubmitting, feedback]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch (error) {
          console.error(error);
        }
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-6xl min-h-[80vh] bg-white border border-slate-200 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[38%] bg-brand-burgundy text-white flex flex-col items-center p-5 sm:p-6 lg:p-7 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-700">
          <div className="w-full max-w-md overflow-hidden border border-white/15 relative min-h-[240px] bg-brand-burgundy">
            <video
              ref={videoRef}
              src={videoSource}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div
              className={`absolute inset-0 bg-white/10 transition-opacity duration-1000 ${isAIPlaying || (isMicOn && !isAIPlaying) ? "opacity-100" : "opacity-0"}`}
            ></div>

            <div className="relative z-10 flex h-full min-h-[240px] flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5 h-16 mb-4">
                {isAIPlaying ? (
                  [1.2, 0.6, 1.5, 0.9, 1.3, 0.7, 1.1].map((_, index) => (
                    <motion.div
                      key={index}
                      animate={{ scaleY: [0.3, 1.2, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.1,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 h-12 bg-white rounded-full origin-center"
                    />
                  ))
                ) : isMicOn && !isAIPlaying ? (
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="absolute w-16 h-16 rounded-full border-2 border-white"
                    />
                    <div className="w-12 h-12 rounded-full bg-white text-brand-red flex items-center justify-center shadow-lg">
                      <FaMicrophone className="animate-pulse" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center">
                    <FaMicrophoneSlash size={20} />
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-lg uppercase tracking-[0.16em] text-white/90">
                  {isAIPlaying
                    ? "AI speaking"
                    : isMicOn
                      ? "Listening"
                      : "Interview paused"}
                </h3>
                <p className="text-xs text-white/75 mt-2">
                  {isAIPlaying
                    ? "Please listen to the question"
                    : isMicOn
                      ? "Speak clearly and naturally"
                      : "Turn the mic back on to continue"}
                </p>
              </div>
            </div>
          </div>

          {subtitle && (
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-slate-100 leading-relaxed text-center">
                {subtitle}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white rounded-[26px] border border-slate-200 shadow-xl p-5">
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Interview status</span>
              {isAIPlaying && (
                <span className="font-semibold text-brand-red">
                  AI speaking
                </span>
              )}
            </div>

            <div className="h-px bg-slate-200 my-4"></div>

            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>

            <div className="h-px bg-slate-200 my-4"></div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-brand-red">
                  {currentIndex + 1}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  Current
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-red">
                  {questions.length}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-medium">
                AI interview
              </p>
              <h2 className="mt-2 text-2xl text-slate-900">
                Voiced evaluation
              </h2>
            </div>
          </div>

          {!isIntroPhase && (
            <div className="relative mb-6 border-l-2 border-brand-red bg-slate-50 p-4 sm:p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                {currentQuestion?.question}
              </div>
            </div>
          )}

          {micError && (
            <div
              role="status"
              className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {micError}
            </div>
          )}

          {submitError && (
            <div
              role="alert"
              className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {submitError}
            </div>
          )}

          <textarea
            aria-label="Your interview answer"
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-[26px] resize-none outline-none p-4 sm:p-6 text-slate-800 focus:ring-2 focus:ring-emerald-500 transition min-h-[220px]"
          />

          {!feedback ? (
            <div className="flex items-center gap-4 mt-6 w-full">
              <motion.button
                type="button"
                onClick={toggleMic}
                aria-label={
                  isMicOn ? "Turn microphone off" : "Turn microphone on"
                }
                aria-pressed={isMicOn}
                title={isMicOn ? "Turn microphone off" : "Turn microphone on"}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shrink-0 hover:bg-slate-800 transition"
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-brand-red hover:bg-red-700 text-white py-3.5 rounded-md transition font-semibold disabled:bg-slate-400"
              >
                {isSubmitting ? "Submitting..." : "Submit answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 border border-emerald-200 bg-emerald-50 p-5"
            >
              <p className="text-emerald-800 font-medium mb-4 leading-relaxed">
                {feedback}
              </p>

              <button
                onClick={handleNext}
                className="w-full bg-brand-red text-white py-3 rounded-md transition hover:bg-red-700 flex items-center justify-center gap-2"
              >
                Next question <BsArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
