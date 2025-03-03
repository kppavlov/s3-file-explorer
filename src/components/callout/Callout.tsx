import "./callout.css";
import { useEffect } from "react";

export type CalloutProps = {
  open: boolean;
  text: string;
  type: "error" | "success";
  onClose?: () => void;
};

let delay: number | null = null;

export const Callout = ({ text, open, type, onClose }: CalloutProps) => {
  useEffect(() => {
    if (delay) {
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
      <span className="callout-close-sign" onClick={onClose}>X</span>
    </div>
  );
};
