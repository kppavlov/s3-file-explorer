import { create, StoreApi, UseBoundStore } from "zustand";
import {
  DirectoryTreeNode,
  FileSystemTree,
  FileTreeNode,
} from "../classes/tree/tree.ts";
import { CalloutProps } from "../components/shared/callout/Callout.tsx";

interface TreeContextState {
  currentWorkingDir: DirectoryTreeNode | null;
  setCurrentWorkingDir: (props: DirectoryTreeNode | null) => void;
  setSelectedCurrentWorkingDir: (path: string) => void;
  setPrerequisite: (contents: Array<Array<string>>, bucketName: string) => void;
  setPathToKeyMap: (...paths: string[]) => void;
  deletePathToKeyMap: (paths: string) => void;
  addNodeToTree: (path: string, node: DirectoryTreeNode | FileTreeNode) => void;
  setCalloutState: (props: CalloutProps) => void;
  setTree: (tree: FileSystemTree) => void;
  removeNodeFromTree: (path: string) => void;
  contents: Array<Array<string>>;
  bucketName: string;
  selectedCurrentWorkingDir: string;
  tree: FileSystemTree | null;
  pathToKeyMap: Record<string, string>;
  calloutState: CalloutProps;
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
  pathToKeyMap: {},
  calloutState: {
    text: "",
    type: "success",
    open: false,
  },
  removeNodeFromTree: (path) =>
    set((state) => ({
      tree: state.tree?.removeNode(path, "path"),
    })),
  addNodeToTree: (path, node) =>
    set((state) => ({
      tree: state.tree?.addNodeToPath(path, node),
    })),
  setCalloutState: (calloutState) =>
    set(() => ({
      calloutState,
    })),
  setPathToKeyMap: (...paths) =>
    set((state) => {
      const newState = {
        pathToKeyMap: {
          ...state.pathToKeyMap,
        },
      };

      for (const path of paths) {
        newState.pathToKeyMap[path] = crypto.randomUUID();
      }

      return newState;
    }),
  deletePathToKeyMap: (path) =>
    set((state) => {
      const newPathToKeyMap = {
        ...state.pathToKeyMap,
      };

      delete newPathToKeyMap[path];

      return {
        pathToKeyMap: {
          ...newPathToKeyMap,
        },
      };
    }),
  setSelectedCurrentWorkingDir: (path) =>
    set(() => ({
      selectedCurrentWorkingDir: path,
    })),
  setTree: (tree) =>
    set(() => ({
      tree,
    })),
  setCurrentWorkingDir: (directory) =>
    set(() => ({
      currentWorkingDir: directory,
    })),
  setPrerequisite: (contents, bucketName) =>
    set(() => ({
      contents,
      bucketName,
    })),
}));

export const useFileExplorerStateSelectors =
  createSelectors(useFileExplorerState);
export const selectSelectedCwdByPath = (path: string) =>
  useFileExplorerState((state) =>
    state.selectedCurrentWorkingDir === path
      ? state.selectedCurrentWorkingDir
      : null,
  );
export const selectKeyToUpdateByPath = (path: string) =>
  useFileExplorerState((state) => state.pathToKeyMap[path]);
