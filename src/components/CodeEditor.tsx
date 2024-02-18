"use client";

import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor: React.FC = () => (
  <Editor
    height="70vh" // Adjust height as needed
    defaultLanguage="javascript"
    defaultValue="// some comment"
    theme="vs-dark"
  />
);

export default CodeEditor;
