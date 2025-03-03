import { describe, it, expect, beforeEach } from "vitest";
import { FileSystemTree } from "./tree";
import { DirectoryTreeNode, FileTreeNode } from "./tree"; // Adjust path based on your actual file structure

describe("FileSystemTree", () => {
  let tree: FileSystemTree;

  beforeEach(() => {
    tree = new FileSystemTree();
  });

  describe("constructor", () => {
    it("should initialize with a root node set as cwd", () => {
      expect(tree.root).toBeInstanceOf(DirectoryTreeNode);
      expect(tree.root?.isCwd).toBe(true);
      expect(tree.root?.value).toBe("root");
    });
  });

  describe("removeNode", () => {
    it("should remove a file node from a directory", () => {
      const dirNode = new DirectoryTreeNode("folder");
      const fileNode = new FileTreeNode("file.txt");
      dirNode.addNode(fileNode);
      tree.root?.addNode(dirNode);

      expect(tree.searchDfs("file.txt")).toBe(fileNode);

      tree.removeNode("folder/file.txt");
      expect(tree.searchDfs("folder/file.txt", "path")).toBeNull();
    });

    it("should gracefully handle removing from non-existing parent path", () => {
      tree.removeNode("non-existing-folder/file.txt");
      expect(tree.searchDfs("file.txt")).toBeNull();
    });
  });

  describe("buildWholeTree", () => {
    it("should build the tree structure from prefixes", () => {
      const prefixes = [
        ["folder", "subfolder", "file.txt"],
        ["folder", "another-file.txt"],
      ];

      tree.buildWholeTree(prefixes);

      expect(tree.searchDfs("folder")).toBeInstanceOf(DirectoryTreeNode);
      expect(tree.searchDfs("subfolder")).toBeInstanceOf(DirectoryTreeNode);
      expect(tree.searchDfs("file.txt")).toBeInstanceOf(FileTreeNode);
      expect(tree.searchDfs("another-file.txt")).toBeInstanceOf(FileTreeNode);
    });

    it("should not fail on empty root", () => {
      tree.root = null;
      tree.buildWholeTree([]);
      expect(tree.root).toBeNull();
    });
  });

  describe("searchDfs", () => {
    it("should find nodes by value", () => {
      const dirNode = new DirectoryTreeNode("folder");
      const fileNode = new FileTreeNode("file.txt");
      dirNode.addNode(fileNode);
      tree.root?.addNode(dirNode);

      expect(tree.searchDfs("file.txt")).toBe(fileNode);
      expect(tree.searchDfs("folder")).toBe(dirNode);
    });

    it("should find nodes by path", () => {
      const dirNode = new DirectoryTreeNode("folder");
      dirNode.path = "/root/folder";

      const fileNode = new FileTreeNode("file.txt");
      fileNode.path = "/root/folder/file.txt";

      dirNode.addNode(fileNode);
      tree.root?.addNode(dirNode);

      expect(tree.searchDfs("/root/folder", "path")).toBe(dirNode);
      expect(tree.searchDfs("/root/folder/file.txt", "path")).toBe(fileNode);
    });

    it("should return null if node is not found", () => {
      expect(tree.searchDfs("non-existing")).toBeNull();
    });
  });

  describe("private search", () => {
    it("should recursively search for nodes", () => {
      const dirNode = new DirectoryTreeNode("folder");
      const fileNode = new FileTreeNode("file.txt");
      dirNode.addNode(fileNode);
      tree.root?.addNode(dirNode);

      // @ts-expect-error Accessing private for testing
      const result = tree.search("file.txt", tree.root);
      expect(result).toBe(fileNode);
    });
  });
});
