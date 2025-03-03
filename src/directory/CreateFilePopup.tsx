import UploadFileIcon from "../assets/upload-icon.png";
import { Input } from "../components/input/input.tsx";
import { Button } from "../components/button/Button.tsx";
import { Popup } from "../components/popup/Popup.tsx";
import { InputState } from "./types.ts";
import { DirectoryTreeNode, FileTreeNode } from "../classes/tree/tree.ts";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import s3 from "../classes/s3-access/s3.ts";
import { defaultInputState } from "./constants.ts";
import { useFileExplorerStateSelectors } from "../state/file-explorer-state.tsx";

export const CreateFilePopup = ({
  isOpen,
  dir,
  setFileNameInputState,
  declineCreation,
}: InputState & {
  dir: DirectoryTreeNode | FileTreeNode;
  setFileNameInputState: Dispatch<SetStateAction<InputState>>;
  declineCreation: () => void;
}) => {
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();

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
      setFileNameInputState((prevState) => ({
        ...prevState,
        error: true,
        errorText: "Please upload a single file!",
      }));
      return;
    }

    if (dir instanceof DirectoryTreeNode) {
      const hasDupNames = dir.nodes.some((nd) => nd.value === val.name);

      if (hasDupNames) {
        setFileNameInputState((prevState) => ({
          ...prevState,
          isOpen: true,
          error: true,
          errorText: "A file or folder with this name already exists!",
        }));
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

      // adds new node to the parent node reference
      const nodeToAdd = new FileTreeNode(val.name, dir.path);
      dir.addNode(nodeToAdd);

      setPathToKeyMap(dir.path, `${dir.path}/${val.name}`);
      setFileNameInputState(defaultInputState);
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

        <Button onClick={createFile}>Upload</Button>

        <Button onClick={declineCreation}>Decline</Button>
      </div>
    </Popup>
  );
};
