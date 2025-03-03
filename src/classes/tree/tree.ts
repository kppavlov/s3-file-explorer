import { IDirectoryTreeNode, IFileTreeNode } from "./types.ts";

export class FileTreeNode implements IFileTreeNode {
  value = "";
  path = "";
  nodes = [];

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

  constructor(value: string, parentPath = "") {
    this.value = value;
    this.nodes = [];
    this.path = `${parentPath}/${value}`;
  }

  addNode(node: DirectoryTreeNode | FileTreeNode) {
    this.nodes.push(node);
  }

  removeNode(value: string, removeBy: "value" | "path" = "value") {
    this.nodes = this.nodes.filter((node) => node[removeBy] !== value);
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

  removeNode(path: string, removeBy: "path" | "value" = "value") {
    const pathSplit = path.split("/");
    pathSplit.pop();
    const parentPath = pathSplit.join("/");
    const parent = this.searchDfs(parentPath, "path");

    if (parent) {
      (parent as DirectoryTreeNode).removeNode(path, removeBy);
    }

    return this;
  }

  addNodeToPath(path: string, node: DirectoryTreeNode | FileTreeNode) {
    const existingNode = this.searchDfs(path, "path");

    if (existingNode && existingNode instanceof DirectoryTreeNode) {
      existingNode.addNode(node);
    }

    return this;
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
      if (!prefix) {
        return;
      }

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

    return this;
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
