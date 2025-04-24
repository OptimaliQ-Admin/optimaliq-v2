"use client";

type Props = {
  isSubmitting: boolean;
  cooldown: number;
  text?: string; // <- Optional prop for button text
};

export default function SubmitButton({ isSubmitting, cooldown, text = "Submit" }: Props) {
  const isDisabled = isSubmitting || cooldown > 0;
  const label = isSubmitting ? "Submitting..." : cooldown > 0 ? `Please wait (${cooldown}s)` : text;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full py-3 rounded-md text-lg font-semibold transition ${
        isDisabled
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {label}
    </button>
  );
}
