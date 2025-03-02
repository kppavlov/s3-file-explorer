import { memo, useEffect } from "react";
import { DirectoryTreeNode, FileSystemTree } from "../../classes/tree/tree.ts";

// HOOKS
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

// STYLES
import "./file-explorer-tree.css";
import { FileExplorerNode } from "./FileExplorerNode.tsx";
import { Title } from "../title/Title.tsx";

export const FileExplorer = memo(() => {
  const bucketName = useFileExplorerStateSelectors.use.bucketName();
  const contents = useFileExplorerStateSelectors.use.contents();
  const setCwd = useFileExplorerStateSelectors.use.setCurrentWorkingDir();
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();
  const setSelectedCurrentWorkingDir =
    useFileExplorerStateSelectors.use.setSelectedCurrentWorkingDir();

  const newTree = new FileSystemTree(new DirectoryTreeNode(bucketName));
  newTree.buildWholeTree(contents, (path: string) => {
    setPathToKeyMap(path);
  });

  useEffect(() => {
    if (bucketName) {
      setCwd(newTree.root);
      setSelectedCurrentWorkingDir(`/${bucketName}`);
    }
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
