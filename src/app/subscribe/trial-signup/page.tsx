import { Suspense } from "react";
import TrialSignupForm from "./TrialSignupForm";

export default function TrialSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trial signup...</p>
        </div>
      </div>
    }>
      <TrialSignupForm />
    </Suspense>
  );
} 