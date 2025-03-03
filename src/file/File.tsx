import { useCallback, useState } from "react";

// ICONS
import DeleteFileIcon from "../assets/delete-file-icon.png";

// COMPONENTS
import { Popup } from "../components/popup/Popup.tsx";
import { Title } from "../components/title/Title.tsx";
import { Button } from "../components/button/Button.tsx";

// CLASSES
import s3 from "../classes/s3-access/s3.ts";

// HOOKS
import { useFileExplorerStateSelectors } from "../state/file-explorer-state.tsx";

// STYLES
import "./file.css";

type Props = {
  value: string;
  path: string;
};

export const File = ({ value, path }: Props) => {
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();
  const removeNodeFromTree =
    useFileExplorerStateSelectors.use.removeNodeFromTree();
  const [openPopup, setOpenPopup] = useState(false);
  const handleDeleteFile = useCallback(async () => {
    try {
      const pathSplit = path.split("/");
      const objectPath = [...pathSplit]
        .splice(2, pathSplit.length - 1)
        .join("/");
      const valueToDelete = !objectPath ? value : objectPath;

      await s3.deleteObject(valueToDelete);

      pathSplit.pop();
      const parentPath = pathSplit.join("/");

      removeNodeFromTree(path);
      setPathToKeyMap(parentPath);
      setOpenPopup(false);
      setCalloutState({
        open: true,
        type: "success",
        text: "Deletion successful!",
      });
    } catch (e) {
      setOpenPopup(false);
      setCalloutState({
        open: true,
        type: "error",
        text: "Something went wrong deleting your file!",
      });
    }
  }, []);

  const handleOpenConfirmPopup = useCallback(() => {
    setOpenPopup(true);
  }, []);

  const handleCloseConfirmPopup = useCallback(() => {
    setOpenPopup(false);
  }, []);

  return (
    <div className="file-styles">
      --{value}{" "}
      <img
        className="delete-file-icon"
        alt="Delete file"
        src={DeleteFileIcon}
        onClick={handleOpenConfirmPopup}
      />
      <Popup open={openPopup}>
        <div className="delete-file-popup-content">
          <Title>Are you sure you want to delete file: {path}?</Title>

          <Button onClick={handleDeleteFile}>Delete</Button>
          <Button onClick={handleCloseConfirmPopup}>Decline</Button>
        </div>
      </Popup>
    </div>
  );
};
