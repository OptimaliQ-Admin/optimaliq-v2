"use client";

type Props = {
  text?: string;
  isSubmitting: boolean;
  cooldown?: number;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function SubmitButton({
  text = "Submit",
  isSubmitting,
  cooldown = 0,
  disabled = false,
  type = "button",
}: Props) {
  const isDisabled = isSubmitting || cooldown > 0 || disabled;
  const label = isSubmitting
    ? "Submitting..."
    : cooldown > 0
    ? `Please wait (${cooldown}s)`
    : text;

  return (
    <button
      type={type}
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
