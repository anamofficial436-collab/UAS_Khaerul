"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES = {
  danger: {
    icon: "bg-red-100",
    iconColor: "text-red-600",
    btn: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: "bg-yellow-100",
    iconColor: "text-yellow-600",
    btn: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  primary: {
    icon: "bg-primary-100",
    iconColor: "text-primary-600",
    btn: "bg-primary-700 hover:bg-primary-800 text-white",
  },
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const style = VARIANT_STYLES[variant];

  // Tutup dengan Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Focus confirm button saat buka
  useEffect(() => {
    if (open) setTimeout(() => confirmRef.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
        <div className={`w-12 h-12 ${style.icon} rounded-xl flex items-center justify-center mb-4`}>
          <AlertTriangle size={22} className={style.iconColor} />
        </div>

        <h3
          id="dialog-title"
          className="font-bold text-gray-900 text-base mb-2"
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex gap-3">
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60 ${style.btn}`}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
