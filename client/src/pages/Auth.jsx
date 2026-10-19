import React from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../config";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useState } from "react";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleGoogleAuth = async () => {
    if (isSigningIn) return;
    setAuthError("");
    setIsSigningIn(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
      setAuthError("Sign-in could not be completed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div
      className={
        isModel
          ? "w-full py-4"
          : "min-h-screen bg-brand-paper flex items-center justify-center px-4 py-10"
      }
    >
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={
          isModel
            ? "w-full max-w-md bg-white border border-slate-200 p-7 relative"
            : "w-full max-w-lg bg-white border border-slate-200 p-8 sm:p-12"
        }
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-brand-burgundy text-white p-2.5">
            <BsRobot size={18} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              AI practice
            </div>
            <h2 className="font-semibold text-lg text-slate-900">
              TheInterviewMind
            </h2>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 border-l-2 border-brand-red pl-3 py-1.5 text-brand-burgundy text-sm font-medium mb-4">
            <IoSparkles size={16} />
            Smart AI interview prep
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
            Welcome back
          </h1>
        </div>

        <p className="text-slate-500 text-center text-sm md:text-base leading-relaxed mb-8">
          Use your Google account to save interview sessions and review your
          feedback.
        </p>

        {authError && (
          <p
            role="alert"
            className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {authError}
          </p>
        )}

        <motion.button
          onClick={handleGoogleAuth}
          disabled={isSigningIn}
          whileHover={{ opacity: 0.96, scale: 1.01 }}
          whileTap={{ opacity: 1, scale: 0.99 }}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-brand-red text-white rounded-md hover:bg-red-700 transition font-medium disabled:cursor-wait disabled:opacity-60"
        >
          <FcGoogle size={20} />
          {isSigningIn ? "Connecting to Google..." : "Continue with Google"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Auth;
