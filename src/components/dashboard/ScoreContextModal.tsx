"use client";

import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

type ScoreContextModalProps = {
  open: boolean;
  onClose: () => void;
  data: {
    title: string;
    description: string;
    benchmark: string;
    focus_areas: string[];
  } | null;
};

export default function ScoreContextModal({ open, onClose, data }: ScoreContextModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
            {data.title}
          </Dialog.Title>
          <p className="text-gray-700 mb-4">{data.description}</p>
          <p className="text-sm text-blue-700 font-semibold mb-4">{data.benchmark}</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {data.focus_areas.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
