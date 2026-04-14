import { useState } from "react";

export default function Modal({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm", confirmDanger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="modal-overlay">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card p-6 w-full max-w-md relative animate-fade-in-up z-10">
        <h3 className="font-heading font-bold text-lg text-text-primary mb-4">{title}</h3>
        <div className="text-text-secondary text-sm mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={confirmDanger ? "btn-danger" : "btn-primary"}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
