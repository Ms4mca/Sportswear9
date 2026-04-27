import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OTPForm from "./OTPForm";
import SetPasswordForm from "./SetPasswordForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import logo from "../../assets/blacklogo.svg";

export default function AuthModal({ isOpen, onClose, mode = "login", setMode }) {
  const [currentPage, setCurrentPage] = useState(mode);

  // Sync mode changes
  useEffect(() => {
    setCurrentPage(mode);
  }, [mode]);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl p-5 sm:p-8 rounded-2xl shadow-xl w-[92%] max-w-md border border-gray-200 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-600 hover:text-blue-500 transition text-2xl font-bold"
        >
          ×
        </button>

        {/* Brand */}
        <img src={logo} alt="SPORTSWEAR9" className="w-40 mx-auto" />

        {/* Form Switch Logic */}
        {currentPage === "login" && (
          <LoginForm
            onSwitchToSignup={() => {
              setCurrentPage("signup");
              setMode?.("signup");
            }}
            onSwitchToForgot={() => setCurrentPage("forgot")}
            onClose={onClose}
          />
        )}
        {currentPage === "signup" && (
          <SignupForm
            onSwitchToLogin={() => {
              setCurrentPage("login");
              setMode?.("login");
            }}
            onSwitchToOTP={() => setCurrentPage("otp")}
            onClose={onClose}
          />
        )}
        {currentPage === "otp" && (
          <OTPForm
            onClose={onClose}
            onSwitchToSetPassword={() => setCurrentPage("setPassword")}
          />
        )}
        {currentPage === "setPassword" && <SetPasswordForm onClose={onClose} />}
        {currentPage === "forgot" && (
          <ForgotPasswordForm
            onSwitchToReset={() => setCurrentPage("reset")}
            onSwitchToLogin={() => setCurrentPage("login")}
          />
        )}
        {currentPage === "reset" && <ResetPasswordForm onClose={onClose} />}
      </div>
    </div>
  );
}
