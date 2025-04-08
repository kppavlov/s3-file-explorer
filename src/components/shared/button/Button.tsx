import { ButtonHTMLAttributes } from "react";

import "./button.css";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: "action" | HTMLButtonElement["type"];
}

export const Button = ({ children, className, type, ...rest }: Props) => {
  if (type === "action") {
    return (
      <button {...rest} className={`button-styles-action ${className}`}>
        {children}
      </button>
    );
  }
  return (
    <button {...rest} className={`button-styles ${className}`}>
      {children}
    </button>
  );
};
