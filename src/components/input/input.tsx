import { InputHTMLAttributes, Ref } from "react";

import "./input.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ className, label, ...rest }: Props) => (
  <div className="input-style">
    {label && <label htmlFor="accessKeySecret">{label}</label>}
    <input {...rest} className={`${className ? className : ""}`} />
  </div>
);
