//src/components/dashboard/ScoreContextModal.tsx
"use client";

import { useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!data) return null;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>

                <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                  {data.title}
                </Dialog.Title>
                <p className="text-gray-600 mb-4">{data.description}</p>
                <p className="text-sm text-blue-700 font-semibold mb-4">
                  {data.benchmark}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {data.focus_areas.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
