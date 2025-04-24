// src/components/growthAssessment/FormHeader.tsx
import { FaShieldAlt } from "react-icons/fa";

export default function FormHeader() {
  return (
    <div className="relative text-left flex flex-col justify-center h-full">
      <h1 className="text-4xl font-bold text-gray-900 text-center leading-tight relative top-[-80px]">
        Unlock Scalable Growth Backed by Data
      </h1>
      <p className="text-gray-600 text-center mt-[-30px] text-lg">
        Make <strong>confident decisions</strong> backed by <strong>data-driven insights</strong>.
        Our analysis <strong>pinpoints hidden opportunities</strong> to refine strategy, boost efficiency, and scale — <strong>fast</strong>.
      </p>
      <div className="absolute bottom-0 left-0 flex items-center space-x-2">
        <FaShieldAlt className="text-blue-600 text-xl" />
        <p className="text-blue-600 text-sm font-semibold">Data Privacy / Security Activated</p>
      </div>
      <p className="absolute bottom-0 right-0 text-gray-500 text-sm">Trusted by industry leaders</p>
    </div>
  );
}
