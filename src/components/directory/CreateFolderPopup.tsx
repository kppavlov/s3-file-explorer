import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useRef,
} from "react";

// COMPONENTS
import { Input } from "../shared/input/input.tsx";
import { Button } from "../shared/button/Button.tsx";
import { Popup } from "../shared/popup/Popup.tsx";

// TYPES
import { InputState } from "./types.ts";

// CLASSES
import { DirectoryTreeNode, FileTreeNode } from "../../classes/tree/tree.ts";

// HOOKS
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

// CONSTANTS
import { defaultInputState } from "./constants.ts";

export const CreateFolderPopup = ({
  isOpen,
  error,
  errorText,
  dir,
  setFolderNameInputState,
  declineCreation,
}: InputState & {
  dir: DirectoryTreeNode | FileTreeNode;
  setFolderNameInputState: Dispatch<SetStateAction<InputState>>;
  declineCreation: () => void;
}) => {
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();
  const inputCreateFolderRef = useRef<HTMLInputElement | null>(null);

  const createFolder = useCallback(() => {
    if (!inputCreateFolderRef.current?.value) {
      setFolderNameInputState((prevState) => ({
        ...prevState,
        error: true,
        errorText: "Input can not be empty!",
      }));
      return;
    }
    const val = inputCreateFolderRef.current.value;

    const hasDupNames = dir.nodes.some((nd) => nd.value === val);

    if (hasDupNames) {
      setFolderNameInputState((prevState) => ({
        ...prevState,
        error: true,
        errorText: "A file or folder with this name already exists!",
      }));
      return;
    }

    if (dir instanceof DirectoryTreeNode) {
      // adds new node to the parent node reference
      const newDir = new DirectoryTreeNode(val, dir.path);
      dir.addNode(newDir);

      setPathToKeyMap(dir.path, `${dir.path}/${val}`);
      setFolderNameInputState(defaultInputState);
    }
  }, [dir]);

  const handleKeyDownCreateFolder = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        createFolder();
      }
    },
    [],
  );

  return (
    <Popup open={isOpen}>
      <div className="input-actions">
        <Input
          autoFocus
          ref={inputCreateFolderRef}
          placeholder="Folder name"
          onKeyDown={handleKeyDownCreateFolder}
          error={error}
          errorText={errorText}
        />

        <Button onClick={createFolder}>Create</Button>

        <Button onClick={declineCreation}>Decline</Button>
      </div>
    </Popup>
  );
};
