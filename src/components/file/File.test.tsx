import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { File } from "./File.tsx";
import s3 from "../../classes/s3-access/s3.ts";

// Mock all the external dependencies (Zustand selectors and S3 service)
const mockSetCalloutState = vi.fn();
const mockSetPathToKeyMap = vi.fn();
const mockRemoveNodeFromTree = vi.fn();
const mockAddNodeToTree = vi.fn();
const mockDeletePathToKeyMap = vi.fn();

vi.mock("../../state/file-explorer-state", () => ({
  useFileExplorerStateSelectors: {
    use: {
      setCalloutState: vi.fn(() => mockSetCalloutState),
      setPathToKeyMap: vi.fn(() => mockSetPathToKeyMap),
      removeNodeFromTree: vi.fn(() => mockRemoveNodeFromTree),
      addNodeToTree: vi.fn(() => mockAddNodeToTree),
      deletePathToKeyMap: vi.fn(() => mockDeletePathToKeyMap),
    },
  },
}));

describe("File Component", () => {
  beforeEach(() => {
    s3.deleteObject = vi.fn().mockReturnValue(() => Promise.resolve());
    s3.getObject = vi.fn().mockReturnValue(() => Promise.resolve());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderFile = (value: string, path: string) => {
    return render(<File value={value} path={path} />);
  };

  it("should render file with the correct name", () => {
    renderFile("test-file.txt", "/root/folder/test-file.txt");

    expect(screen.getByText("--test-file.txt")).toBeInTheDocument();
  });

  it("should open confirm popup when delete icon is clicked", async () => {
    renderFile("test-file.txt", "/root/folder/test-file.txt");

    const deleteIcon = screen.getAllByAltText("Delete file")[0];
    deleteIcon.click();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Are you sure you want to delete file: test-file.txt?",
        ),
      ).toBeInTheDocument();
    });
  });

  it("should close confirm popup when decline button is clicked", async () => {
    renderFile("test-file.txt", "/root/folder/test-file.txt");

    const deleteIcon = screen.getAllByAltText("Delete file")[0];
    deleteIcon.click();

    await waitFor(() => {
      const declineButton = screen.getByText("Decline");
      declineButton.click();
    });

    expect(
      screen.queryByText(
        "Are you sure you want to delete file: /root/folder/test-file.txt?",
      ),
    ).not.toBeInTheDocument();
  });

  it("should call S3 deleteObject and update state on delete confirm", async () => {
    renderFile("test-file.txt", "/root/folder/test-file.txt");

    const deleteIcon = screen.getAllByAltText("Delete file")[0];
    deleteIcon.click();

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      deleteButton.click();
    });

    await waitFor(() => {
      expect(s3.deleteObject).toHaveBeenCalledWith("folder/test-file.txt");
      expect(mockRemoveNodeFromTree).toHaveBeenCalledWith(
        "/root/folder/test-file.txt",
      );
      expect(mockSetPathToKeyMap).toHaveBeenCalledWith("/root/folder");
      expect(mockSetCalloutState).toHaveBeenCalledWith({
        open: true,
        type: "success",
        text: "Deletion successful!",
      });
    });
  });

  it("should show error callout if S3 deleteObject fails", async () => {
    vi.mocked(s3.deleteObject).mockRejectedValue(new Error("Delete failed"));

    renderFile("test-file.txt", "/root/folder/test-file.txt");

    const deleteIcon = screen.getAllByAltText("Delete file")[0];
    deleteIcon.click();

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      deleteButton.click();
    });

    expect(mockSetCalloutState).toHaveBeenCalledWith({
      open: true,
      type: "error",
      text: "Something went wrong deleting your file!",
    });
  });

  it("should show error callout if file download fails", async () => {
    vi.mocked(s3.getObject).mockRejectedValue(new Error("Download failed"));

    const res = renderFile("test-file.txt", "/root/folder/test-file.txt");

    const fileLink = res?.container.querySelector(".file-styles")
      ?.children?.[0] as HTMLElement;

    fileLink.click();

    await waitFor(() => {
      expect(mockSetCalloutState).toHaveBeenCalledWith({
        open: true,
        type: "error",
        text: "Something went wrong downloading your file!",
      });
    });
  });
});
