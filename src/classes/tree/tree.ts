import { ComponentType } from "react";
import { Directory } from "../../components/directory/Directory.tsx";
import { File } from "../../components/file/File.tsx";

interface ITreeNode<Node> {
  value: string;
  path: string;
  nodes: Node[];
  Component: ComponentType<{ value: string; path: string }>;
}

interface IFileTreeNode extends ITreeNode<never> {
  value: string;
  clone: () => IFileTreeNode;
}

interface IDirectoryTreeNode
  extends ITreeNode<DirectoryTreeNode | FileTreeNode> {
  isCwd: boolean;
  value: string;
  nodes: (DirectoryTreeNode | FileTreeNode)[];
  addNode(node: DirectoryTreeNode | FileTreeNode): void;
  removeNode(value: (DirectoryTreeNode | FileTreeNode)["value"]): void;
  clone: () => IDirectoryTreeNode;
}

export class FileTreeNode implements IFileTreeNode {
  value = "";
  path = "";
  nodes = [];
  Component = File;

  constructor(value: string, parentPath = "") {
    this.value = value;
    this.path = `${parentPath}/${value}`;
  }

  clone() {
    const newFile = new FileTreeNode("");
    newFile.nodes = [];
    newFile.path = this.path;
    newFile.value = this.value;
    return newFile;
  }
}

export class DirectoryTreeNode implements IDirectoryTreeNode {
  isCwd = false;
  value: IDirectoryTreeNode["value"] = "";
  nodes: (DirectoryTreeNode | FileTreeNode)[] = [];
  path = "";
  Component = Directory;

  constructor(value: string, parentPath = "") {
    this.value = value;
    this.nodes = [];
    this.path = `${parentPath}/${value}`;
  }

  addNode(node: DirectoryTreeNode | FileTreeNode) {
    this.nodes.push(node);
  }

  removeNode(value: string) {
    this.nodes = this.nodes.filter((node) => node.value !== value);
  }

  clone() {
    const newDir = new DirectoryTreeNode("");
    const self = this;
    newDir.nodes = this.nodes.map((nd) => self.cloneNode(nd));
    newDir.isCwd = this.isCwd;
    newDir.path = this.path;
    newDir.value = this.value;
    return newDir;
  }

  private cloneNode(node: DirectoryTreeNode | FileTreeNode) {
    if (node instanceof FileTreeNode) {
      return node.clone();
    }

    const clonedNode = node.clone();
    const self = this;
    clonedNode.nodes = node.nodes.map((nd) => self.cloneNode(nd));

    return clonedNode;
  }
}

export class FileSystemTree {
  root: DirectoryTreeNode | null;

  constructor(value = new DirectoryTreeNode("root")) {
    value.isCwd = true;
    this.root = value;
  }

  updateNode(value: string, newNode: DirectoryTreeNode | FileTreeNode) {
    if (!this.root) {
      return null;
    }

    this.replaceNode(this.root.nodes, newNode, value);

    return this;
  }

  replaceNode(
    nodes: (DirectoryTreeNode | FileTreeNode)[],
    newNode: DirectoryTreeNode | FileTreeNode,
    value: string,
    searchBy: "value" | "path" = "value",
  ) {
    const children = nodes;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child[searchBy] === value) {
        children[i] = newNode;
        break;
      } else {
        this.replaceNode(child.nodes, newNode, value, searchBy);
      }
    }
  }

  clone() {
    if (!this.root) {
      return new FileSystemTree();
    }

    const newTree = new FileSystemTree(new DirectoryTreeNode(this.root.value));

    const { nodes } = this.root;

    for (const node of nodes) {
      newTree.root?.addNode(this.cloneNode(node));
    }

    return newTree;
  }

  private cloneNode(node: DirectoryTreeNode | FileTreeNode) {
    if (node instanceof FileTreeNode) {
      return node.clone();
    }

    const clonedNode = node.clone();
    const self = this;
    clonedNode.nodes = node.nodes.map((nd) => self.cloneNode(nd));

    return clonedNode;
  }

  buildWholeTree(prefixes: Array<Array<string>>) {
    if (!this.root) {
      return;
    }

    for (const prefix of prefixes) {
      this.addNodesByPrefix(prefix, this.root);
    }
  }

  addNodesByPrefix(
    prefixes: Array<string>,
    node: DirectoryTreeNode | FileTreeNode,
  ) {
    let prevNode: DirectoryTreeNode | FileTreeNode | null = null;
    const prefixesLength = prefixes.length - 1;

    prefixes.forEach((prefix, idx) => {
      const existingNode = this.searchDfs(prefix);

      if (!existingNode && prefixesLength === idx) {
        const currentNode = node as DirectoryTreeNode;
        const fileNode = new FileTreeNode(prefix);

        if (prevNode && prevNode instanceof DirectoryTreeNode) {
          fileNode.path = `${prevNode.path}/${prefix}`;
          prevNode.addNode(fileNode);
        } else {
          currentNode.addNode(fileNode);
        }

        prevNode = fileNode;
      } else if (!existingNode && prefixesLength !== idx) {
        const dirNode = new DirectoryTreeNode(prefix);
        const currentNode = node as DirectoryTreeNode;

        if (prevNode && prevNode instanceof DirectoryTreeNode) {
          dirNode.path = `${prevNode.path}/${prefix}`;

          prevNode.addNode(dirNode);
        } else {
          dirNode.path = `${currentNode.path}/${prefix}`;
          currentNode.addNode(dirNode);
        }

        prevNode = dirNode;
      } else {
        prevNode = existingNode;
      }
    });
  }

  searchDfs(
    value: string,
    searchBy?: "value" | "path",
  ): DirectoryTreeNode | FileTreeNode | null {
    if (!this.root || !value) return null;

    return this.search(value, this.root, searchBy);
  }

  private search(
    value: (DirectoryTreeNode | FileTreeNode)["value"],
    root: DirectoryTreeNode | FileTreeNode,
    searchBy: "value" | "path" = "value",
  ): DirectoryTreeNode | FileTreeNode | null {
    if (value === root[searchBy]) {
      return root;
    }
    const children = root.nodes;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const nodeFound = this.search(value, child, searchBy);
      if (nodeFound) {
        return nodeFound;
      }
    }

    return null;
  }
}
