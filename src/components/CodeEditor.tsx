"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "@/axios";
import { AxiosError } from "axios";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState("// Write your code here");
  const [stdout, setStdout] = useState(""); // For standard output
  const [stderr, setStderr] = useState(""); // For error messages

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const executeCode = async () => {
    try {
      const response = await axiosInstance.post("/execute", {
        code,
      });

      console.log(response.data);
      setStdout(response.data || "No output");
      stderr && setStderr("");
      // Display execution result to the user
    } catch (error: any) {
      setStdout("");
      if (error instanceof AxiosError) {
        return setStderr(error.response?.data.message || "An error occurred");
      }
      console.error("Error executing code:", error);
      return setStdout(error.message);
    }
    // Handle error
  };

  return (
    <>
      <button
        onClick={executeCode}
        className="order-2 md:order-1 w-full md:w-auto self-end mb-2 p-2 bg-blue-500 text-white"
      >
        Run Code
      </button>
      <div className="flex flex-col md:flex-row">
        <div className="order-1 md:order-2 flex-1">
          <Editor
            height="70vh"
            defaultLanguage="javascript"
            defaultValue={code}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </div>
        <div
          className="order-3 md:w-1/3 bg-gray-800 text-white p-4 overflow-auto"
          style={{ height: "70vh" }}
        >
          <h3 className="text-lg font-bold">Terminal</h3>
          <pre>{stdout}</pre>
          <pre className="text-red-500">{stderr}</pre>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
