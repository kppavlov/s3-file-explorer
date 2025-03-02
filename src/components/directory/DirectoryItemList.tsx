import { DirectoryTreeNode, FileTreeNode } from "../../classes/tree/tree.ts";
import { FileExplorerNode } from "../file-explorer/FileExplorerNode.tsx";

type Props = {
  items: (DirectoryTreeNode | FileTreeNode)[];
  showDirsOnly?: boolean;
};

export const DirectoryItemList = ({ items, showDirsOnly }: Props) => (
  <ul className="nodes-wrapper">
    {items?.map((node) => (
      <FileExplorerNode
        key={node.path}
        node={node}
        showDirsOnly={showDirsOnly}
      />
    ))}
  </ul>
);
