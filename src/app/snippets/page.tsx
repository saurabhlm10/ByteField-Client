"use client";

import axiosInstance from "@/axios";
import CodeSnippets from "@/components/CodeSnippets";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import { useEffect, useState } from "react";

const Page = () => {
  const [snippets, setSnippets] = useState([]);
  const getAllSnippets = async () => {
    try {
      const response = await axiosInstance.get("/snippet");

      setSnippets(response.data);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  useEffect(() => {
    getAllSnippets();

    return () => {
      setSnippets([]);
    };
  }, []);

  return <CodeSnippets snippets={snippets} />;
};

export default Page;
