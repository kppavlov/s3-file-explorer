import { useCallback } from "react";
import { Callout } from "../shared/callout/Callout.tsx";
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

export const CalloutBox = () => {
  const calloutProps = useFileExplorerStateSelectors.use.calloutState();
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();

  const handleClose = useCallback(() => {
    setCalloutState({
      open: false,
      text: "",
      type: "success",
    });
  }, []);

  return <Callout {...calloutProps} onClose={handleClose} />;
};
