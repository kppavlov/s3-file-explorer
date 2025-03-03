import { render, screen, waitFor } from "@testing-library/react";
import { DirectoryActions } from "./DirectoryActions.tsx";
import { DirectoryTreeNode, FileTreeNode } from "../classes/tree/tree.ts";
import { describe, it, vi, beforeEach, expect } from "vitest";

const mockSetCalloutState = vi.fn();
const mockSetPathToKeyMap = vi.fn();
const mockRemoveNodeFromTree = vi.fn();
const mockAddNodeToTree = vi.fn();

vi.mock("../state/file-explorer-state", () => ({
  useFileExplorerStateSelectors: {
    use: {
      setCalloutState: vi.fn(() => mockSetCalloutState),
      setPathToKeyMap: vi.fn(() => mockSetPathToKeyMap),
      removeNodeFromTree: vi.fn(() => mockRemoveNodeFromTree),
      addNodeToTree: vi.fn(() => mockAddNodeToTree),
    },
  },
}));

describe("DirectoryActions", () => {
  const renderComponent = (props = {}) => {
    return render(
      <DirectoryActions
        dir={new DirectoryTreeNode("folder")}
        showDirsOnly={false}
        handleExpandDir={vi.fn()}
        expanded={false}
        {...props}
      />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing when no directory is provided", () => {
    const { container } = render(
      <DirectoryActions
        dir={null}
        showDirsOnly={false}
        handleExpandDir={vi.fn()}
        expanded={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the expand/collapse arrow if directory has children", () => {
    const dir = new DirectoryTreeNode("folder");
    dir.addNode(new DirectoryTreeNode("child-folder"));

    renderComponent({ dir });

    expect(screen.getByAltText("Collapse/expand image")).toBeInTheDocument();
  });

  it("renders arrow filler if all children are files (and showDirsOnly=true)", async () => {
    const dir = new DirectoryTreeNode("folder");
    dir.addNode(new FileTreeNode("file.txt"));

    renderComponent({ dir, showDirsOnly: true });

    await waitFor(() => {
      expect(
        screen.getByText("", { selector: ".arrow-filler" }),
      ).toBeInTheDocument();
    });
  });

  it("renders new file and folder icons when showDirsOnly=false", () => {
    renderComponent();

    const newFolderIcon = screen.getAllByAltText("New file icon")[0];
    const newFileIcon = screen.getAllByAltText("New file icon")[1];

    expect(newFolderIcon).toBeInTheDocument();
    expect(newFileIcon).toBeInTheDocument();
  });

  it("opens folder creation popup when folder icon is clicked", async () => {
    renderComponent();

    await waitFor(() => {
      const newFolderIcon = screen.getAllByAltText("New file icon")[0];
      newFolderIcon.click();
    });

    const folderPopup = screen.getByText("Create");
    expect(folderPopup).toBeInTheDocument();
  });

  it("opens file creation popup when file icon is clicked", async () => {
    renderComponent();

    await waitFor(() => {
      const newFileIcon = screen.getAllByAltText("New file icon")[1];
      newFileIcon.click();
    });

    const filePopup = screen.getByText("Upload");
    expect(filePopup).toBeInTheDocument();
  });

  it("calls setCalloutState when declining creation", async () => {
    renderComponent();

    await waitFor(() => {
      const newFileIcon = screen.getAllByAltText("New file icon")[1];
      newFileIcon.click();
    });

    const declineButton = screen.getAllByText("Decline")[0];
    declineButton.click();

    await waitFor(() => {
      expect(mockSetCalloutState).toHaveBeenCalledWith({
        open: false,
        text: "",
        type: "success",
      });
    });
  });
});
