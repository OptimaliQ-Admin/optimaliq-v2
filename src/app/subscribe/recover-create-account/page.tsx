import { Suspense } from "react";
import RecoverCreateAccountForm from "./RecoverCreateAccountForm";

export default function RecoverCreateAccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Complete Your OptimaliQ Account</h1>
        <p className="text-gray-600 text-center mt-2 mb-6">We found your payment, but you didn&apos;t finish creating your account. Complete the form below to get started.</p>

        <Suspense fallback={<div>Loading form...</div>}>
          <RecoverCreateAccountForm />
        </Suspense>
      </div>
    </div>
  );
} 