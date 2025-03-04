import { PropsWithChildren } from "react";

import "./popup.css";

interface Props {
  open: boolean;
}

export const Popup = ({ children, open }: PropsWithChildren<Props>) => {
  if (!open) {
    return null;
  }
  return (
    <div className="popup-styles">
      <div className="popup-contents">{children}</div>
    </div>
  );
};
