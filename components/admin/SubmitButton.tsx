"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label: string;
  pendingLabel?: string;
  variant?: "primary" | "danger";
  className?: string;
  disabled?: boolean;
};

export default function SubmitButton({
  label,
  pendingLabel,
  variant = "primary",
  className = "",
  disabled = false,
}: Props) {
  const { pending } = useFormStatus();

  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand text-paper hover:bg-ink",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={[base, variants[variant], className].join(" ")}
    >
      {pending ? (pendingLabel ?? `${label}…`) : label}
    </button>
  );
}
