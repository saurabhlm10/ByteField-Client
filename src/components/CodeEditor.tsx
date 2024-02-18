"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import axiosInstance from "@/axios";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState("// Write your code here");

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const executeCode = async () => {
    try {
      const response = await axiosInstance.post("/execute", {
        code,
      });
      console.log(response.data);
      // Display execution result to the user
    } catch (error) {
      console.error("Error executing code:", error);
      // Handle error
    }
  };

  return (
    <>
      <Editor
        height="70vh"
        defaultLanguage="javascript"
        defaultValue={code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
      <button onClick={executeCode} className="mt-4 p-2 bg-blue-500 text-white">
        Run Code
      </button>
    </>
  );
};

export default CodeEditor;
