import { memo } from "react";
import { Directory } from "../directory/Directory.tsx";
import { DirectoryTreeNode, FileSystemTree } from "../../classes/tree/tree.ts";

// HOOKS
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

// STYLES
import "./file-explorer-tree.css";

export const FileExplorer = memo(() => {
  const bucketName = useFileExplorerStateSelectors.use.bucketName();
  const contents = useFileExplorerStateSelectors.use.contents();
  const setCwd = useFileExplorerStateSelectors.use.setCurrentWorkingDir();
  const setTree = useFileExplorerStateSelectors.use.setTree();

  if (!bucketName) {
    return null;
  }

  const newTree = new FileSystemTree(new DirectoryTreeNode(bucketName));
  newTree.buildWholeTree(contents);

  setCwd(newTree.root);

  setTree(newTree);

  if (!newTree.root) {
    return null;
  }

  return (
    <div className="fs-tree file-explorer-tree-styles">
      <Directory
        value={newTree.root.value}
        path={newTree.root.path}
        showDirsOnly
      />
    </div>
  );
});
