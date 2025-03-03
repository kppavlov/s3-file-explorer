import { ButtonHTMLAttributes } from "react";

import "./button.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, className, ...rest }: Props) => {
  return <button {...rest} className={`button-styles ${className}`}>{children}</button>;
};
