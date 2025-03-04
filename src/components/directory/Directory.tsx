import { useCallback, useState } from "react";
import { DirectoryTreeNode, FileTreeNode } from "../../classes/tree/tree.ts";

// HOOKS
import {
  selectSelectedCwdByPath,
  selectKeyToUpdateByPath,
  useFileExplorerStateSelectors,
} from "../../state/file-explorer-state.tsx";

// COMPONENTS
import { DirectoryActions } from "./DirectoryActions.tsx";
import { DirectoryItemList } from "./DirectoryItemList.tsx";

// STYLES
import "./directory.css";

type Props = {
  showDirsOnly?: boolean;
  data: DirectoryTreeNode | FileTreeNode;
};

export const Directory = ({ data, showDirsOnly = false }: Props) => {
  const { path, value, nodes } = data;
  const setCwd = useFileExplorerStateSelectors.use.setCurrentWorkingDir();
  const setSelectedCurrentWorkingDir =
    useFileExplorerStateSelectors.use.setSelectedCurrentWorkingDir();
  const currentWorkingDir = selectSelectedCwdByPath(path);
  const keyToUse = selectKeyToUpdateByPath(path);
  const [expanded, setExpanded] = useState(false);

  const handleCWDCreation = () => {
    if (!data || !showDirsOnly || data instanceof FileTreeNode) {
      return;
    }

    setSelectedCurrentWorkingDir(path);
    setCwd(data);
  };

  const handleExpandDir = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <div className="directory-styles" id={path} key={keyToUse}>
      <DirectoryActions
        handleExpandDir={handleExpandDir}
        showDirsOnly={showDirsOnly}
        expanded={expanded}
        dir={data}
      >
        <p
          className={`${path === currentWorkingDir ? "current-working-directory" : ""}`}
          onDoubleClick={handleCWDCreation}
        >
          {value}
        </p>
      </DirectoryActions>

      {expanded && (
        <DirectoryItemList items={nodes} showDirsOnly={showDirsOnly} />
      )}
    </div>
  );
};
