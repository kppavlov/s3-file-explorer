import "./App.css";
import { BucketConfigForm } from "./components/bucket-config-form/BucketConfigForm.tsx";
import { CurrentWorkingDirectory } from "./components/current-working-directory/CurrentWorkingDirectory.tsx";
import { FileExplorer } from "./components/file-explorer/FileExplorer.tsx";

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
    </>
  );
}

export default App;
