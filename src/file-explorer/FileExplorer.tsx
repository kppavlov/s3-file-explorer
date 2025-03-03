import { memo, useEffect } from "react";
import { DirectoryTreeNode, FileSystemTree } from "../classes/tree/tree.ts";

// HOOKS
import { useFileExplorerStateSelectors } from "../state/file-explorer-state.tsx";

// STYLES
import "./file-explorer-tree.css";
import { FileExplorerNode } from "./FileExplorerNode.tsx";
import { Title } from "../components/title/Title.tsx";
import s3 from "../classes/s3-access/s3.ts";

const THIRTY_SECONDS = 1000 * 30;

export const FileExplorer = memo(() => {
  const bucketName = useFileExplorerStateSelectors.use.bucketName();
  const contents = useFileExplorerStateSelectors.use.contents();
  const setCwd = useFileExplorerStateSelectors.use.setCurrentWorkingDir();
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();
  const setTree = useFileExplorerStateSelectors.use.setTree();
  const setPrerequisite = useFileExplorerStateSelectors.use.setPrerequisite();
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();
  const setSelectedCurrentWorkingDir =
    useFileExplorerStateSelectors.use.setSelectedCurrentWorkingDir();

  const newTree = new FileSystemTree(new DirectoryTreeNode(bucketName));
  newTree.buildWholeTree(contents, (path: string) => {
    setPathToKeyMap(path);
  });

  const startPollingS3 = () => {
    return setInterval(async () => {
      try {
        const s3CurrentObjects = await s3.listObjects();

        const contents =
          s3CurrentObjects?.Contents?.map(({ Key }) =>
            (Key ?? "").split("/"),
          ) ?? [];

        setPrerequisite(contents, bucketName);
      } catch (e) {
        setCalloutState({
          type: "error",
          text: "Something went wrong during polling for S3 changes!",
          open: true,
        });
      }
    }, THIRTY_SECONDS);
  };

  useEffect(() => {
    let interval: number;

    if (bucketName) {
      setCwd(newTree.root);
      setSelectedCurrentWorkingDir(`/${bucketName}`);
      setTree(newTree);
      interval = startPollingS3();
    }

    return () => {
      clearInterval(interval);
    };
  }, [newTree, bucketName]);

  if (!newTree.root || !bucketName) {
    return null;
  }

  return (
    <div>
      <Title>File explorer</Title>
      <div className="fs-tree">
        <FileExplorerNode node={newTree.root} showDirsOnly />
      </div>
    </div>
  );
});
