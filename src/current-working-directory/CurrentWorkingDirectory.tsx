import { memo } from "react";

// HOOKS
import { useFileExplorerStateSelectors } from "../state/file-explorer-state.tsx";

// COMPONENTS
import { FileExplorerNode } from "../file-explorer/FileExplorerNode.tsx";
import { Title } from "../components/title/Title.tsx";

// STYLES
import "./current-working-directory.css";

export const CurrentWorkingDirectory = memo(() => {
  const cwd = useFileExplorerStateSelectors.use.currentWorkingDir();

  if (!cwd) {
    return null;
  }

  return (
    <div>
      <Title>Current working directory</Title>
      <div className="fs-tree cwd-tree-styles">
        <FileExplorerNode node={cwd} />
      </div>
    </div>
  );
});
