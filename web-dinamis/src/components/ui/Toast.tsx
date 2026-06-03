"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ============================================================
// Toast System — Context + Hook + Renderer
// ============================================================

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (type: ToastType, message: string, duration?: number) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((msg: string) => addToast("success", msg), [addToast]);
  const error = useCallback((msg: string) => addToast("error", msg), [addToast]);
  const warning = useCallback((msg: string) => addToast("warning", msg), [addToast]);
  const info = useCallback((msg: string) => addToast("info", msg), [addToast]);

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ── Toast Item ────────────────────────────────────────────
const TOAST_STYLES: Record<ToastType, { bg: string; icon: React.ReactNode; bar: string }> = {
  success: {
    bg: "bg-white border-l-4 border-green-500",
    icon: <CheckCircle size={18} className="text-green-500 shrink-0" />,
    bar: "bg-green-500",
  },
  error: {
    bg: "bg-white border-l-4 border-red-500",
    icon: <XCircle size={18} className="text-red-500 shrink-0" />,
    bar: "bg-red-500",
  },
  warning: {
    bg: "bg-white border-l-4 border-yellow-500",
    icon: <AlertTriangle size={18} className="text-yellow-500 shrink-0" />,
    bar: "bg-yellow-500",
  },
  info: {
    bg: "bg-white border-l-4 border-blue-500",
    icon: <Info size={18} className="text-blue-500 shrink-0" />,
    bar: "bg-blue-500",
  },
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const style = TOAST_STYLES[toast.type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`
        pointer-events-auto relative overflow-hidden rounded-xl shadow-lg
        ${style.bg}
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {style.icon}
        <p className="flex-1 text-sm font-medium text-gray-800 leading-snug">
          {toast.message}
        </p>
        <button
          onClick={() => onRemove(toast.id)}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      </div>
      {/* Progress bar */}
      <div
        className={`h-0.5 ${style.bar} origin-left`}
        style={{
          animation: `shrink ${toast.duration || 4000}ms linear forwards`,
        }}
      />
      <style jsx>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
