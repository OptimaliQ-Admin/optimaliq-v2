"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SimulationContextType {
  simulation: {
    isOpen: boolean;
  };
  setSimulation: (simulation: { isOpen: boolean }) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [simulation, setSimulation] = useState({ isOpen: false });

  return (
    <SimulationContext.Provider value={{ simulation, setSimulation }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
} 