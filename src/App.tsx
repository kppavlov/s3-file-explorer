import "./App.css";
import { BucketConfigForm } from "./bucket-config-form/BucketConfigForm.tsx";
import { CurrentWorkingDirectory } from "./current-working-directory/CurrentWorkingDirectory.tsx";
import { FileExplorer } from "./file-explorer/FileExplorer.tsx";
import { CalloutBox } from "./callout-box/CalloutBox.tsx";

function App() {
  return (
    <>
      <BucketConfigForm />

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <FileExplorer />

        <CurrentWorkingDirectory />
      </div>

      <CalloutBox />
    </>
  );
}

export default App;
