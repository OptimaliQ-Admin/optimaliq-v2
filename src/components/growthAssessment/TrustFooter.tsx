// src/components/growthAssessment/TrustFooter.tsx
import { FaShieldAlt } from "react-icons/fa";

export default function TrustFooter() {
  return (
    <>
      <div className="absolute bottom-0 left-0 flex items-center space-x-2">
        <FaShieldAlt className="text-blue-600 text-xl" />
        <p className="text-blue-600 text-sm font-semibold">Data Privacy / Security Activated</p>
      </div>
      <p className="absolute bottom-0 right-0 text-gray-500 text-sm">
        Trusted by industry leaders
      </p>
    </>
  );
}
