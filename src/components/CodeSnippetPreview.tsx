"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface CodeSnippetPreviewProps {
  snippet: {
    name: string;
    code: string;
  };
}

const CodeSnippetPreview: React.FC<CodeSnippetPreviewProps> = ({ snippet }) => {
  const router = useRouter();
  // Slice the code to show only the first lines
  const previewCode = snippet.code.split("\n").slice(0, 5).join("\n");

  const handleClick = () => {
    localStorage.setItem("code", snippet.code);
    router.push("/editor");
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-gray-800 text-white p-5 mb-4 rounded w-80 mx-2"
    >
      <h2 className="font-bold text-2xl mb-2 bg-gray-700 p-2 rounded">
        {snippet.name}
      </h2>
      <pre className="text-base overflow-auto">
        <code>{previewCode}</code>
      </pre>
    </div>
  );
};

export default CodeSnippetPreview;
