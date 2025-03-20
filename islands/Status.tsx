"use client";
import { useState } from "preact/hooks";

type StatusProps = {
  type: "success" | "error";
  message: string;
};

export function Status({ type, message }: StatusProps) {
  const color = type === "success" ? "bg-green" : "bg-red";
  return (
    <div className={`p-4 rounded-md text-white ${color}`}>
      {message}
    </div>
  );
}

export function useStatus() {
  const [status, setStatus] = useState<StatusProps | null>(null);

  const showStatus = (type: "success" | "error", message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  return { status, showStatus };
}
