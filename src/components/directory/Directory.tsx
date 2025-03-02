import { useState } from "react";
import { FileTreeNode } from "../../classes/tree/tree.ts";

import "./directory.css";

// HOOKS
import {
  pathLevelCwdSubscription,
  pathLevelDirectorySubscription,
  useFileExplorerStateSelectors,
} from "../../state/file-explorer-state.tsx";

// COMPONENTS
import { DirectoryActions } from "./DirectoryActions.tsx";

type Props = {
  value: string;
  path: string;
  showDirsOnly?: boolean;
};

export const Directory = ({ value, path, showDirsOnly = false }: Props) => {
  const setCwd = useFileExplorerStateSelectors.use.setCurrentWorkingDir();
  const setSelectedCurrentWorkingDir =
    useFileExplorerStateSelectors.use.setSelectedCurrentWorkingDir();
  const dir = pathLevelDirectorySubscription(path);
  const selectedCurrentWorkingDirPath = pathLevelCwdSubscription(path);
  const [expanded, setExpanded] = useState(false);

  const handleCWDCreation = () => {
    if (!dir || !showDirsOnly || dir instanceof FileTreeNode) {
      return;
    }

    setSelectedCurrentWorkingDir(dir.path);
    setCwd(dir);
  };

  const handleExpandDir = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="directory-styles">
      <DirectoryActions
        handleExpandDir={handleExpandDir}
        showDirsOnly={showDirsOnly}
        expanded={expanded}
        dir={dir}
      >
        <p
          className={`${dir?.path === selectedCurrentWorkingDirPath ? "current-working-directory" : ""}`}
          onDoubleClick={handleCWDCreation}
        >
          {dir?.value}
        </p>
      </DirectoryActions>

      {expanded && (
        <ul className="nodes-wrapper">
          {dir?.nodes?.map((node) => {
            const {
              path: currNodePath,
              value: currNodeValue,
              Component,
            } = node;

            if (showDirsOnly && node instanceof FileTreeNode) {
              return null;
            }

            return (
              <li key={value + currNodePath}>
                <Component
                  value={currNodeValue}
                  path={currNodePath}
                  showDirsOnly={showDirsOnly}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
