import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth";
import { useRef } from "react";

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.querySelector("button:not([disabled])")?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/45 px-4 py-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
      >
        <button
          type="button"
          aria-label="Close sign-in dialog"
          onClick={onClose}
          className="absolute top-8 right-5 z-10 text-gray-800 hover:text-black text-xl"
        >
          <FaTimes size={18} />
        </button>
        <Auth isModel={true} />
      </div>
    </div>
  );
}

export default AuthModel;
