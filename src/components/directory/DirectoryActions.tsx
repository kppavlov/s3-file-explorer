import { PropsWithChildren, useCallback, useState, useMemo } from "react";

// ICONS
import ArrowDown from "../../assets/arrow-down-icon.png";
import NewFolderIcon from "../../assets/new-folder-icon.png";
import NewFileIcon from "../../assets/new-file-icon.png";

// CLASSES
import { DirectoryTreeNode, FileTreeNode } from "../../classes/tree/tree.ts";

// HOOKS
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

// TYPES
import { InputState } from "./types.ts";

// CONSTANTS
import { defaultInputState } from "./constants.ts";

// COMPONENTS
import { CreateFolderPopup } from "./CreateFolderPopup.tsx";
import { CreateFilePopup } from "./CreateFilePopup.tsx";
import { Button } from "../shared/button/Button.tsx";

type Props = {
  showDirsOnly: boolean;
  expanded: boolean;
  handleExpandDir: () => void;
  dir?: DirectoryTreeNode | FileTreeNode | null;
};

export const DirectoryActions = ({
  children,
  showDirsOnly,
  handleExpandDir,
  expanded,
  dir,
}: PropsWithChildren<Props>) => {
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();
  const [folderNameInputState, setFolderNameInputState] =
    useState<InputState>(defaultInputState);
  const [fileCreationState, setFileCreationState] =
    useState<InputState>(defaultInputState);
  const shouldRemoveArrow = useMemo(() => {
    if (!showDirsOnly) {
      return dir?.nodes.length === 0;
    }

    return dir?.nodes.every((nd) => nd instanceof FileTreeNode);
  }, [dir]);

  const handleAddNewDirectory = useCallback(() => {
    setFolderNameInputState((prevState) => ({
      ...prevState,
      isOpen: true,
    }));
  }, []);

  const handleAddNewFile = useCallback(() => {
    setFileCreationState((prevState) => ({
      ...prevState,
      isOpen: true,
    }));
  }, []);

  const declineCreation = useCallback(() => {
    setCalloutState({
      open: false,
      text: "",
      type: "success",
    });
    setFolderNameInputState(defaultInputState);
    setFileCreationState(defaultInputState);
  }, []);

  if (!dir) {
    return null;
  }

  return (
    <>
      <div className="value-actions">
        {!shouldRemoveArrow ? (
          <Button type="action" onClick={handleExpandDir}>
            <img
              className={`arrow ${expanded ? "expand-arrow" : "collapse-arrow"}`}
              alt="Collapse/expand image"
              src={ArrowDown}
            />
          </Button>
        ) : (
          <div className="arrow-filler"></div>
        )}

        {children}

        {!showDirsOnly && (
          <>
            <Button type="action" onClick={handleAddNewDirectory}>
              <img
                className="img-hover-effect"
                alt="New file icon"
                src={NewFolderIcon}
              />
            </Button>

            <Button type="action" onClick={handleAddNewFile}>
              <img
                className="img-hover-effect"
                alt="New file icon"
                src={NewFileIcon}
              />
            </Button>
          </>
        )}
      </div>

      <CreateFolderPopup
        {...folderNameInputState}
        declineCreation={declineCreation}
        setFolderNameInputState={setFolderNameInputState}
        dir={dir}
      />

      <CreateFilePopup
        dir={dir}
        declineCreation={declineCreation}
        {...fileCreationState}
      />
    </>
  );
};
