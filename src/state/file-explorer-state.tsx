import { create, StoreApi, UseBoundStore } from "zustand";
import {
  DirectoryTreeNode,
  FileSystemTree,
  FileTreeNode,
} from "../classes/tree/tree.ts";

interface TreeContextState {
  currentWorkingDir: DirectoryTreeNode | null;
  setCurrentWorkingDir: (props: DirectoryTreeNode | null) => void;
  setSelectedCurrentWorkingDir: (path: string) => void;
  setContents: (contents: Array<Array<string>>) => void;
  setBucketName: (bucketName: string) => void;
  setTree: (tree: FileSystemTree | null) => void;
  updateTreePath: (
    path: string,
    newNode: FileTreeNode | DirectoryTreeNode,
  ) => void;
  contents: Array<Array<string>>;
  bucketName: string;
  selectedCurrentWorkingDir: string;
  tree: FileSystemTree | null;
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const useFileExplorerState = create<TreeContextState>()((set) => ({
  currentWorkingDir: null,
  bucketName: "",
  contents: [],
  tree: null,
  selectedCurrentWorkingDir: "",
  setSelectedCurrentWorkingDir: (path) =>
    set(() => ({
      selectedCurrentWorkingDir: path,
    })),
  updateTreePath: (path: string, newNode: FileTreeNode | DirectoryTreeNode) =>
    set((state) => ({
      tree: state.tree?.updateNode(path, newNode),
    })),
  setTree: (tree) =>
    set(() => ({
      tree,
    })),
  setCurrentWorkingDir: (directory) =>
    set(() => ({
      currentWorkingDir: directory,
    })),
  setContents: (contents) =>
    set(() => ({
      contents,
    })),
  setBucketName: (bucketName) =>
    set(() => ({
      bucketName,
    })),
}));

export const useFileExplorerStateSelectors = createSelectors(useFileExplorerState);
export const pathLevelDirectorySubscription = (path: string) =>
  useFileExplorerState((state) => state.tree?.searchDfs(path, "path"));
export const pathLevelCwdSubscription = (path: string) =>
  useFileExplorerState((state) =>
    state.selectedCurrentWorkingDir === path
      ? state.selectedCurrentWorkingDir
      : null,
  );
