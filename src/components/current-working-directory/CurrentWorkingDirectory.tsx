import { Directory } from "../directory/Directory.tsx";
import { memo } from "react";
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

import "./current-working-directory.css";

export const CurrentWorkingDirectory = memo(() => {
  const cwd = useFileExplorerStateSelectors.use.currentWorkingDir();

  if (!cwd) {
    return null;
  }

  return (
    <div className="fs-tree cwd-tree-styles">
      <Directory value={cwd.value} path={cwd.path} />
    </div>
  );
});
