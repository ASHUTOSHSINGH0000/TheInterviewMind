import React from "react";
import { BsRobot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2">
              <BsRobot size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">
                TheInterviewMind
              </h2>
              <p className="text-xs text-slate-300 uppercase">
                Interview practice
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200"
          >
            {[
              ["Home", "/"],
              ["Interview history", "/history"],
              ["Pricing", "/pricing"],
            ].map(([label, path]) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="transition hover:text-white"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-5 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            A focused place to practice role-specific questions and review your
            answers.
          </p>
          <p>© 2026 TheInterviewMind</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
