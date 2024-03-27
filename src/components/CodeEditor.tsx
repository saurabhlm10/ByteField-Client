"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "@/axios";
import { AxiosError } from "axios";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import Tabs from "./Tabs";

interface PageProps {
  projectId: string;
  openFiles: Set<IFileFolder>;
  setOpenFiles: Dispatch<SetStateAction<Set<IFileFolder>>>;
  updateFileContent: (content: string) => void;
  activeFile: IFileFolder;
  setActiveFile: Dispatch<SetStateAction<IFileFolder>>;
  onFileSelect: (file: IFileFolder) => void;
}

const CodeEditor: React.FC<PageProps> = ({
  projectId,
  openFiles,
  setOpenFiles,
  updateFileContent,
  activeFile,
  setActiveFile,
  onFileSelect,
}) => {
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");

  const handleEditorChange = (value: string | undefined) => {
    setActiveFile((prevActiveFile) => {
      return { ...prevActiveFile, content: value || "" };
    });

    setOpenFiles((prevOpenFiles) => {
      const newOpenFiles = new Set(prevOpenFiles);
      newOpenFiles.forEach((file) => {
        if (file.id === activeFile.id) {
          file.content = value || "";
        }
      });
      return newOpenFiles;
    });

    updateFileContent(value || "");
  };

  const executeCode = async () => {
    try {
      const response = await axiosInstance.post("/execute", {
        code: activeFile.content,
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
      const response = await axiosInstance.put("/file-folder/" + projectId, {
        code: activeFile.content,
      });
    } catch (error) {
      apiErrorHandler(error);
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
          <div className="md:w-2/3 mb-4 md:mb-0 md:mr-4">
            <Tabs
              fileTabs={openFiles}
              setOpenFiles={setOpenFiles}
              activeFile={activeFile}
              setActiveFile={
                setActiveFile as Dispatch<SetStateAction<IFileFolder | null>>
              }
              onFileSelect={onFileSelect}
            />
            <Editor
              height="70vh"
              value={activeFile.content}
              defaultLanguage="javascript"
              defaultValue={activeFile.content}
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
