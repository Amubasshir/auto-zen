"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  kicker?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function Drawer({ open, onClose, title, kicker, footer, children }: Props) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: "oklch(0 0 0 / 0.5)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed top-0 right-0 bottom-0 z-51 flex flex-col bg-zen-raised border-l border-zen-line"
        style={{
          width: "min(560px, 100vw)",
          boxShadow: "-30px 0 80px -20px oklch(0 0 0 / 0.6)",
          transform: open ? "none" : "translateX(105%)",
          transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zen-line shrink-0">
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-zen-text-4 tracking-[0.08em]">
            {kicker}
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="w-8 h-8 rounded-[8px] grid place-items-center text-zen-text-3 border border-transparent hover:bg-zen-surface hover:text-zen-text hover:border-zen-line transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-auto flex-1 flex flex-col gap-0">
          {title && (
            <h2 className="font-serif text-[28px] leading-tight m-0 mb-2.5">{title}</h2>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-zen-line flex gap-2.5 items-center shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
