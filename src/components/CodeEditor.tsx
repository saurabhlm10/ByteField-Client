"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "@/axios";
import { AxiosError } from "axios";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import Tabs from "./Tabs";

interface PageProps {
  projectId: string;
  files: Files;
  setFiles: Dispatch<SetStateAction<Files>>;
  updateFileContent: (content: string) => void;
  onFileSelect: (file: IFileFolder) => void;
}

const CodeEditor: React.FC<PageProps> = ({
  projectId,
  files,
  setFiles,
  updateFileContent,
  onFileSelect,
}) => {
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");

  const handleEditorChange = (value: string | undefined) => {
    setFiles((prevFiles) => {
      const newOpenFiles = new Set(prevFiles.open);

      const activeFile = prevFiles.active;

      newOpenFiles.forEach((file) => {
        if (file.id === files.active?.id) {
          file.content = value || "";
          file.isSaved = file.content !== value;
        }
      });

      if (!activeFile) return prevFiles;

      return {
        ...prevFiles,
        active: activeFile,
        open: newOpenFiles,
      };
    });

    updateFileContent(value || "");
  };

  const executeCode = async () => {
    try {
      const response = await axiosInstance.post("/execute", {
        code: files.active?.content,
      });
      setStdout(response.data || "No output");
      stderr && setStderr("");
    } catch (error: any) {
      setStdout("");
      if (error instanceof AxiosError) {
        return setStderr(error.response?.data.message || "An error occurred");
      }
      console.error("Error executing code:", error);
      return setStdout(error.message);
    }
  };

  const saveCode = async () => {
    try {
      const response = await axiosInstance.put(
        "/file-folder/" + projectId + "/" + files.active?.id,
        {
          content: files.active?.content,
        }
      );
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Check if CTRL (or Command on Mac) and 'S' keys are pressed together
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault(); // Prevent the browser's default save dialog

      setFiles((prevFiles) => {
        const newOpenFiles = new Set(prevFiles.open);
        newOpenFiles.forEach((file) => {
          if (file.id === prevFiles.active?.id) {
            file.isSaved = true;
          }
        });
        return { ...prevFiles, open: newOpenFiles };
      });

      saveCode();
    }
  };
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="container mx-auto py-8">
        <div className="mx-auto flex justify-center gap-4">
          <button
            onClick={executeCode}
            className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md mb-4"
          >
            Run Code
          </button>
          <button
            onClick={saveCode}
            className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md mb-4"
          >
            Save Code
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div
            className="md:w-2/3 mb-4 md:mb-0 md:mr-4"
            onKeyDown={handleKeyDown}
          >
            <Tabs
              files={files}
              fileTabs={files.open}
              setFiles={setFiles}
              onFileSelect={onFileSelect}
            />
            <Editor
              height="70vh"
              value={files.active?.content}
              defaultLanguage="javascript"
              defaultValue={files.active?.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              className="rounded-md shadow-md"
            />
          </div>
          <div className="md:w-1/3 bg-gray-800 text-white p-4 rounded-md shadow-md overflow-auto">
            <h3 className="text-lg font-bold mb-2">Terminal</h3>
            <pre className="whitespace-pre-wrap">{stdout}</pre>
            <pre className="text-red-500 whitespace-pre-wrap">{stderr}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
