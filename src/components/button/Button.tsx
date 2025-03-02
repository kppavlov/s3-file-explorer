import "./button.css";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, className, ...rest }: Props) => {
  return <button {...rest} className={`button-styles ${className}`}>{children}</button>;
};
