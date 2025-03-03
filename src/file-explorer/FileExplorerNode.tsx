import { DirectoryTreeNode, FileTreeNode } from "../classes/tree/tree.ts";
import { Directory } from "../directory/Directory.tsx";
import { File } from "../file/File.tsx";

type NodeProps = {
  node: DirectoryTreeNode | FileTreeNode;
  showDirsOnly?: boolean;
};

export const FileExplorerNode = ({ node, showDirsOnly }: NodeProps) => {
  if (node instanceof DirectoryTreeNode) {
    return <Directory data={node} showDirsOnly={showDirsOnly} />;
  }

  if (showDirsOnly) {
    return null;
  }

  return <File value={node.value} path={node.path} />;
};
