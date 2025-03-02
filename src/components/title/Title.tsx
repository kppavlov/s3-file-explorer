import { HtmlHTMLAttributes } from "react";

interface Props extends HtmlHTMLAttributes<HTMLHeadingElement> {}

export const Title = ({ children, ...rest }: Props) => {
  return <h3 {...rest}>{children}</h3>;
};
