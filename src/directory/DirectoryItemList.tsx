import { DirectoryTreeNode, FileTreeNode } from "../classes/tree/tree.ts";
import { FileExplorerNode } from "../file-explorer/FileExplorerNode.tsx";

type Item = DirectoryTreeNode | FileTreeNode;

type Props = {
  items: Item[];
  showDirsOnly?: boolean;
};

const sortFoldersFirst = (nodeA: Item, nodeB: Item) => {
  const isADir = nodeA instanceof DirectoryTreeNode;
  const isBDir = nodeB instanceof DirectoryTreeNode;

  if (isADir && !isBDir) return -1; // Directories come first
  if (!isADir && isBDir) return 1;  // Files come after directories

  return nodeA.value.localeCompare(nodeB.value);
};

export const DirectoryItemList = ({ items, showDirsOnly }: Props) => (
  <ul className="nodes-wrapper">
    {items
      ?.sort(sortFoldersFirst)
      .map((node) => (
        <FileExplorerNode
          key={node.path}
          node={node}
          showDirsOnly={showDirsOnly}
        />
      ))}
  </ul>
);
