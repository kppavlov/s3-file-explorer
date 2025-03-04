import { useEffect } from "react";

import "./callout.css";

export type CalloutProps = {
  open: boolean;
  text: string;
  type: "error" | "success";
  onClose?: () => void;
};

let delay: number | null = null;

export const Callout = ({ text, open, type, onClose }: CalloutProps) => {
  useEffect(() => {
    if (!open || delay) {
      return;
    }

    delay = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => {
      if (!delay) {
        return;
      }
      clearTimeout(delay);
      delay = null;
    };
  }, [open]);
  if (!open) {
    return null;
  }

  const errorClass = type === "error" ? "error" : "";
  const successClass = type === "success" ? "success" : "";

  return (
    <div className={`callout-styles ${errorClass} ${successClass}`}>
      <span>{text}</span>
      <span className="callout-close-sign" onClick={onClose}>
        X
      </span>
    </div>
  );
};
