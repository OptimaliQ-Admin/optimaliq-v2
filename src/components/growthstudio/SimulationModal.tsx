"use client";

import { Dialog } from "@headlessui/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function SimulationModal({ isOpen, onClose, userId }: SimulationModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-xl shadow-xl">
          <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
            📊 Simulation Results
          </Dialog.Title>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">
                Simulation results will be displayed here.
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 text-right">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 