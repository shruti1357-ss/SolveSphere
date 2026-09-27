import React from "react";
import { useAdmin } from "../../../context/AdminContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContainer = () => {
  const { toasts, removeToast } = useAdmin();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        let border = "border-emerald-200 bg-white text-slate-800";

        if (toast.type === "error") {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          border = "border-rose-200 bg-white text-slate-800";
        } else if (toast.type === "info") {
          icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;
          border = "border-sky-200 bg-white text-slate-800";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-bottom-5 duration-300 ${border}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-xs font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
