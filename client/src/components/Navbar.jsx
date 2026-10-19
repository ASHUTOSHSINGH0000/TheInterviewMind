import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import {
  FaUserAstronaut,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../config";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 px-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative flex w-full items-center justify-between gap-3 py-3"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <BsRobot size={18} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                AI practice
              </div>
              <h1 className="font-semibold text-base sm:text-lg text-slate-900">
                TheInterviewMind
              </h1>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1.5">
            <button
              onClick={() => navigate("/")}
              aria-current={pathname === "/" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${pathname === "/" ? "bg-red-100 text-red-900" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              Home
            </button>
            <button
              onClick={() => navigate("/history")}
              aria-current={pathname === "/history" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${pathname === "/history" ? "bg-red-100 text-red-900" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              History
            </button>
            <button
              onClick={() => navigate("/pricing")}
              aria-current={pathname === "/pricing" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${pathname === "/pricing" ? "bg-red-100 text-red-900" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              Pricing
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 relative">
            {!userData && (
              <>
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-red-700 transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Get started
                </button>
              </>
            )}
            {userData && (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      if (!userData) {
                        setShowAuth(true);
                        return;
                      }
                      setShowCreditPopup(!showCreditPopup);
                      setShowUserPopup(false);
                    }}
                    className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-2 rounded-full text-sm font-semibold hover:bg-emerald-100 transition"
                  >
                    <BsCoin size={16} />
                    {userData?.credits || 0}
                  </button>

                  {showCreditPopup && (
                    <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl border border-slate-200 rounded-2xl p-4 z-50">
                      <p className="text-sm text-slate-600 mb-3">
                        Need more interview credits?
                      </p>
                      <button
                        onClick={() => navigate("/pricing")}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition"
                      >
                        Buy more credits
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      if (!userData) {
                        setShowAuth(true);
                        return;
                      }
                      setShowUserPopup(!showUserPopup);
                      setShowCreditPopup(false);
                    }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-2.5 py-2 rounded-full font-semibold hover:bg-slate-800 transition"
                  >
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      {userData ? (
                        userData?.name?.slice(0, 1).toUpperCase()
                      ) : (
                        <FaUserAstronaut size={14} />
                      )}
                    </span>
                    <FaChevronDown size={10} className="text-slate-300" />
                  </button>

                  {showUserPopup && (
                    <div className="absolute right-0 mt-3 w-52 bg-white shadow-2xl border border-slate-200 rounded-2xl p-3 z-50">
                      <p className="text-sm text-slate-500 mb-2">
                        Signed in as
                      </p>
                      <p className="text-base font-semibold text-slate-900 mb-3">
                        {userData?.name}
                      </p>
                      <button
                        onClick={() => navigate("/history")}
                        className="w-full text-left text-sm py-2.5 px-2 hover:bg-slate-100 rounded-xl text-slate-700"
                      >
                        Interview History
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-sm py-2.5 px-2 hover:bg-red-50 rounded-xl flex items-center gap-2 text-red-500"
                      >
                        <HiOutlineLogout size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-800"
            aria-label={
              showMobileMenu ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={showMobileMenu}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>

          {showMobileMenu && (
            <nav
              className="absolute left-0 right-0 top-full z-50 border border-slate-200 bg-white p-3 shadow-lg md:hidden"
              aria-label="Mobile navigation"
            >
              {[
                ["Home", "/"],
                ["Interview history", "/history"],
                ["Pricing", "/pricing"],
              ].map(([label, path]) => (
                <button
                  key={path}
                  aria-current={pathname === path ? "page" : undefined}
                  onClick={() => {
                    navigate(path);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full border-l-2 px-3 py-3 text-left text-sm font-medium ${pathname === path ? "border-red-600 bg-red-50 text-red-900" : "border-transparent text-slate-700 hover:bg-slate-50"}`}
                >
                  {label}
                </button>
              ))}
              {!userData && (
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setShowMobileMenu(false);
                  }}
                  className="mt-2 w-full rounded-md bg-emerald-600 px-3 py-3 text-left text-sm font-semibold text-white"
                >
                  Sign in or get started
                </button>
              )}
              {userData && (
                <div className="mt-2 border-t border-slate-200 px-3 pt-3 text-sm text-slate-600">
                  {userData.name} · {userData.credits || 0} credits
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="mt-3 block font-semibold text-red-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </nav>
          )}
        </motion.div>

        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      </div>
    </header>
  );
}

export default Navbar;
