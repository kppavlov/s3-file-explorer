export const makeBrowserDownloadFile = (
  bytesArray: Uint8Array,
  fileName: string,
) => {
  const base64File = window.URL.createObjectURL(new Blob([bytesArray]));
  const anchor = document.createElement("a");
  anchor.href = base64File;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(base64File);
};
