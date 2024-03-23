"use client";

import axiosInstance from "@/axios";
import CodeEditor from "@/components/CodeEditor";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import React, { FC, useEffect, useState } from "react";

interface PageProps {
  params: {
    snippetId: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const getSnippet = async (snippetId: string) => {
    try {
      const response = await axiosInstance.get("/snippet/" + snippetId);

      setCode(response.data.code);
      setName(response.data.name);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  useEffect(() => {
    getSnippet(params.snippetId);

    return () => {
      setCode("");
    };
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold my-4">Code Editor</h1>
      <h1 className="text-xl font-semibold my-4">{}</h1>

      {code && (
        <CodeEditor
          code={code}
          setCode={setCode}
          snippetId={params.snippetId}
        />
      )}
    </div>
  );
};

export default Page;
