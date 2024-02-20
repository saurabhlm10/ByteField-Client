"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "@/axios";
import { AxiosError } from "axios";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState("// Write your code here");
  const [executionResult, setExecutionResult] = useState("");

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const executeCode = async () => {
    try {
      const response = await axiosInstance.post("/execute", {
        code,
      });

      console.log(response.data);
      setExecutionResult(response.data || response.data.stderr || "No output");
      // Display execution result to the user
    } catch (error: any) {
      if (error instanceof AxiosError) {
        return setExecutionResult(
          error.response?.data.message || "An error occurred"
        );
      }
      console.error("Error executing code:", error);
      return setExecutionResult(error.message);
    }
    // Handle error
  };

  return (
    <>
      <button
        onClick={executeCode}
        className="self-end mb-2 p-2 bg-blue-500 text-white"
      >
        Run Code
      </button>
      <div className="flex">
        <div className="flex-1 flex flex-col">
          <Editor
            height="calc(70vh)" // Adjust height to account for button
            defaultLanguage="javascript"
            defaultValue="// Write your code here"
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </div>
        <div
          className="flex-1 bg-gray-800 text-white p-4 overflow-auto"
          style={{ height: "70vh" }}
        >
          <h3 className="text-lg font-bold">Terminal</h3>
          <pre>{executionResult}</pre>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
