import {
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
  KeyboardEvent,
} from "react";
import ArrowDown from "../../assets/arrow-down-icon.png";
import NewFolderIcon from "../../assets/new-folder-icon.png";
import NewFileIcon from "../../assets/new-file-icon.png";
import { Input } from "../input/input.tsx";
import { DirectoryTreeNode, FileTreeNode } from "../../classes/tree/tree.ts";
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";
import { Button } from "../button/Button.tsx";
import s3 from "../../classes/s3-access/s3.ts";

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
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();
  const inputCreateFolderRef = useRef<HTMLInputElement | null>(null);
  const inputCreateFileRef = useRef<HTMLInputElement | null>(null);
  const [showFolderNameInput, setShowFolderNameInput] = useState(false);
  const [showFileNameInput, setShowFileNameInput] = useState(false);
  const shouldRemoveArrow = useMemo(() => {
    if (!showDirsOnly) {
      return dir?.nodes.length === 0;
    }

    return dir?.nodes.every((nd) => nd instanceof FileTreeNode);
  }, [dir]);
  const updateTreePath = useFileExplorerStateSelectors.use.updateTreePath();

  const handleAddNewDirectory = useCallback(() => {
    setShowFolderNameInput(true);
  }, []);
  const handleAddNewFile = useCallback(() => {
    setShowFileNameInput(true);
  }, []);
  const declineCreation = useCallback(() => {
    setShowFolderNameInput(false);
    setShowFileNameInput(false);
  }, []);

  const createFolder = useCallback(() => {
    if (!inputCreateFolderRef.current?.value) {
      return;
    }
    const val = inputCreateFolderRef.current.value;

    if (dir instanceof DirectoryTreeNode) {
      const hasDupNames = dir.nodes.some((nd) => nd.value === val);
      if (hasDupNames) {
        return;
      }
      const newDir = new DirectoryTreeNode(val, dir.path);
      dir.addNode(newDir);
      updateTreePath(dir.value, dir);
      setPathToKeyMap(dir.path, `${dir.path}/${val}`);

      setShowFolderNameInput(false);
    }
  }, [dir]);

  const createFile = useCallback(async () => {
    if (!inputCreateFileRef.current?.value) {
      return;
    }
    const val = inputCreateFileRef.current?.files?.[0];

    if (!val) {
      return;
    }

    if (dir instanceof DirectoryTreeNode) {
      // removes the bucket name from the path
      const dirSplit = dir.path.split("/");
      const objectPath = dirSplit.splice(2, dirSplit.length - 1).join("/");

      await s3.createObject(val, `${objectPath}/${val.name}`);

      const nodeToAdd = new FileTreeNode(val.name, dir.path);
      dir.addNode(nodeToAdd);
      updateTreePath(dir.value, dir);
      setPathToKeyMap(dir.path, `${dir.path}/${val}`);
      setShowFileNameInput(false);
    }
  }, []);

  const handleKeyDownCreateFolder = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        createFolder();
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      declineCreation();
    };
  }, []);

  if (!dir) {
    return null;
  }

  return (
    <>
      <div className="value-actions">
        {!shouldRemoveArrow ? (
          <img
            className={`arrow ${expanded ? "expand-arrow" : "collapse-arrow"}`}
            alt="Arrow image"
            src={ArrowDown}
            onClick={handleExpandDir}
          />
        ) : (
          <div className="arrow-filler"></div>
        )}

        {children}

        {!showDirsOnly && (
          <>
            <img
              className="img-hover-effect"
              alt="New file icon"
              src={NewFolderIcon}
              onClick={handleAddNewDirectory}
            />
            <label htmlFor="file-upload">
              <img
                className="img-hover-effect"
                alt="New file icon"
                src={NewFileIcon}
                onClick={handleAddNewFile}
              />{" "}
            </label>
          </>
        )}
      </div>

      {showFolderNameInput && (
        <div className="input-actions">
          <Input
            autoFocus
            ref={inputCreateFolderRef}
            placeholder="Folder name"
            onKeyDown={handleKeyDownCreateFolder}
          />
          <Button onClick={createFolder}>Create</Button>
          <Button onClick={declineCreation}>Decline</Button>
        </div>
      )}

      {showFileNameInput && (
        <div className="input-actions">
          <Input
            ref={inputCreateFileRef}
            id="file-upload"
            type="file"
            style={{ display: "none" }}
          />
          <Button onClick={createFile}>Create</Button>
          <Button onClick={declineCreation}>Decline</Button>
        </div>
      )}
    </>
  );
};
