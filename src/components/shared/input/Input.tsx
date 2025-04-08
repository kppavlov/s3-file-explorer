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
  id,
  ...rest
}: Props) => (
  <div className="input-style">
    {label && <label htmlFor={id}>{label}</label>}
    <input {...rest} id={id} className={`${className ? className : ""}`} />
    {error && errorText && <label className="label-error">{errorText}</label>}
  </div>
);
