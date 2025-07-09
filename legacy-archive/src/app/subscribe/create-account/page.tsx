// File: src/app/subscribe/create-account/page.tsx
import { Suspense } from "react";
import CreateAccountForm from "./CreateAccountForm";

export default function CreateAccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Create Your OptimaliQ Account</h1>
        <p className="text-gray-600 text-center mt-2 mb-6">We just need a few more details to get you started.</p>

        <Suspense fallback={<div>Loading form...</div>}>
          <CreateAccountForm />
        </Suspense>
      </div>
    </div>
  );
}
