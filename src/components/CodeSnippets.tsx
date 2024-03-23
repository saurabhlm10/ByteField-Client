// File: client/src/components/CodeSnippets.tsx

import React from "react";
import CodeSnippetPreview from "./CodeSnippetPreview";

interface CodeSnippetsProps {
  snippets: Snippet[];
}

const CodeSnippets: React.FC<CodeSnippetsProps> = ({ snippets }) => {
  return (
    <div className="mt-8 code-snippets flex flex-wrap justify-center gap-4">
      {snippets.map((snippet, index) => (
        <CodeSnippetPreview key={index} snippet={snippet} />
      ))}
    </div>
  );
};

export default CodeSnippets;
