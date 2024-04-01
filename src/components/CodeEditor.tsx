"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "@/axios";
import { AxiosError } from "axios";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import Tabs from "./Tabs";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

interface PageProps {
  projectId: string;
  files: Files;
  setFiles: Dispatch<SetStateAction<Files>>;
  updateFileContent: (content: string) => void;
  onFileSelect: (file: IFileFolder) => void;
  name: string;
}

const CodeEditor: React.FC<PageProps> = ({
  projectId,
  files,
  setFiles,
  updateFileContent,
  onFileSelect,
  name,
}) => {
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [outputUrl, setOutputUrl] = useState("");

  useEffect(() => {
    socket.on("log", (log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    socket.on("port", (port: string) => {
      setOutputUrl(`http://localhost:${port}`);
    });

    return () => {
      socket.off("log");
    };
  }, []);

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
    setLogs([]);
    try {
      const response = await axiosInstance.post("/execute", {
        fileStructure: {
          id: projectId,
          name,
          isFolder: true,
          children: files.all,
        },
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
    setLogs([]);
    try {
      const updateFileInDBPromise = axiosInstance.put(
        "/file-folder/" + projectId + "/" + files.active?.id,
        {
          content: files.active?.content,
        }
      );

      const executeNewCodePromise = await axiosInstance.put("/execute", {
        fileStructure: {
          id: projectId,
          name,
          isFolder: true,
          children: files.all,
        },
      });

      await Promise.all([updateFileContent, executeNewCodePromise]);
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
        <div>
          <div className="mx-auto flex justify-center gap-4">
            <button
              onClick={executeCode}
              disabled={outputUrl ? true : false}
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
          {outputUrl && (
            <div>
              See The Output:{" "}
              <a href={outputUrl} target="_blank" className="underline">
                {outputUrl}
              </a>
              &nbsp;🔗
            </div>
          )}
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
              language={
                files.active?.name.endsWith(".json") ? "json" : "javascript"
              }
              defaultValue={files.active?.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              className="rounded-md shadow-md"
            />
          </div>
          <div className="md:w-1/3 bg-gray-800 text-white p-4 rounded-md shadow-md overflow-auto">
            <h3 className="text-lg font-bold mb-2">Terminal</h3>
            {logs.map((log, i) => (
              <pre key={i} className="whitespace-pre-wrap">
                {log}
              </pre>
            ))}
            {/* <pre className="whitespace-pre-wrap">{stdout}</pre>
            <pre className="text-red-500 whitespace-pre-wrap">{stderr}</pre> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
