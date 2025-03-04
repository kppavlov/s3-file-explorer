import { ChangeEvent, useCallback, useRef, useState } from "react";

// ICONS
import UploadFileIcon from "../../assets/upload-icon.png";

// COMPONENTS
import { Input } from "../shared/input/input.tsx";
import { Button } from "../shared/button/Button.tsx";
import { Popup } from "../shared/popup/Popup.tsx";

// TYPES
import { InputState } from "./types.ts";

// CLASSES
import { DirectoryTreeNode, FileTreeNode } from "../../classes/tree/tree.ts";
import s3 from "../../classes/s3-access/s3.ts";

// HOOKS
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

export const CreateFilePopup = ({
  isOpen,
  dir,
  declineCreation,
}: InputState & {
  dir: DirectoryTreeNode | FileTreeNode;
  declineCreation: () => void;
}) => {
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();
  const addNodeToTree = useFileExplorerStateSelectors.use.addNodeToTree();

  const inputCreateFileRef = useRef<HTMLInputElement | null>(null);

  const [readyForUploadFileName, setReadyForUploadFileName] = useState("");

  const handleOnFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    setReadyForUploadFileName(file.name);
  }, []);

  const createFile = useCallback(async () => {
    const val = inputCreateFileRef.current?.files?.[0];

    if (!val) {
      setCalloutState({
        open: true,
        type: "error",
        text: "Please upload a single file!",
      });
      return;
    }

    const hasDupNames = dir.nodes.some((nd) => nd.value === val.name);

    if (hasDupNames) {
      setCalloutState({
        open: true,
        type: "error",
        text: "A file or folder with this name already exists!",
      });
      return;
    }

    // removes the bucket name from the path
    const dirSplit = dir.path.split("/");
    const objectPath = dirSplit.splice(2, dirSplit.length - 1).join("/");

    try {
      await s3.createObject(
        val,
        !objectPath ? val.name : `${objectPath}/${val.name}`,
      );
    } catch (e) {
      setCalloutState({
        open: true,
        type: "error",
        text: "We could not upload the file to S3!",
      });
      return;
    }

    if (dir instanceof DirectoryTreeNode) {
      // adds new node to the parent node reference
      const nodeToAdd = new FileTreeNode(val.name, dir.path);

      addNodeToTree(dir.path, nodeToAdd);
      setPathToKeyMap(dir.path, `${dir.path}/${val.name}`);
      setCalloutState({
        open: true,
        type: "success",
        text: `File ${val.name} has been uploaded successfully!`,
      });
    }
  }, []);

  return (
    <Popup open={isOpen}>
      <div className="input-actions">
        <label htmlFor="file-upload">
          <img
            className="upload-file-icon"
            alt="Upload file icon"
            src={UploadFileIcon}
          />
        </label>

        <Input
          ref={inputCreateFileRef}
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleOnFileChange}
        />

        {readyForUploadFileName && <label>{readyForUploadFileName}</label>}

        <Button disabled={!readyForUploadFileName} onClick={createFile}>
          Upload
        </Button>

        <Button onClick={declineCreation}>Decline</Button>
      </div>
    </Popup>
  );
};
