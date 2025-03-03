import { InputHTMLAttributes, Ref } from "react";

import "./input.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  ref?: Ref<HTMLInputElement>;
  error?: boolean;
  errorText?: string;
}

export const Input = ({
  className,
  label,
  errorText,
  error,
  ...rest
}: Props) => (
  <div className="input-style">
    {label && <label htmlFor="accessKeySecret">{label}</label>}
    <input {...rest} className={`${className ? className : ""}`} />
    {error && errorText && <label className="label-error">{errorText}</label>}
  </div>
);
