import { DirectoryTreeNode, FileTreeNode } from "./tree.ts";

export interface ITreeNode<Node> {
  value: string;
  path: string;
  nodes: Node[];
}

export interface IFileTreeNode extends ITreeNode<never> {
  value: string;
  clone: () => IFileTreeNode;
}

export interface IDirectoryTreeNode
  extends ITreeNode<DirectoryTreeNode | FileTreeNode> {
  isCwd: boolean;
  value: string;
  nodes: (DirectoryTreeNode | FileTreeNode)[];
  addNode(node: DirectoryTreeNode | FileTreeNode): void;
  removeNode(value: (DirectoryTreeNode | FileTreeNode)["value"]): void;
  clone: () => IDirectoryTreeNode;
}
