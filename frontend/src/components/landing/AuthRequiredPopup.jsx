import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

const AuthRequiredPopup = ({
  isOpen,
  onClose,
  title = "Login Required",
  message = "Please login or create an account to report a problem and contribute to SolveSphere.",
  buttonText = "OK",
  onAction,
  variant = "warning",
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, 5500);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-xl border border-red-400/30 bg-gradient-to-b from-[#24101a] to-[#0c172e] p-5 shadow-2xl shadow-red-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          ×
        </button>

        {/* Warning Icon */}
        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg border ${variant === "success" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-400" : "border-red-400/30 bg-red-500/10 text-red-400"}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold tracking-tight text-white">
          {title}
        </h3>

        {/* Message */}
        <p className="mt-2 pr-6 text-sm leading-6 text-slate-300">
          {message}
        </p>

        {/* OK Button */}
        <button
          type="button"
          onClick={onAction || onClose}
          className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${variant === "success" ? "bg-emerald-500/90 hover:bg-emerald-500" : "bg-red-500/90 hover:bg-red-500"}`}
        >
          {buttonText}
        </button>
      </motion.div>
    </div>,
    document.body
  );
};

export default AuthRequiredPopup;