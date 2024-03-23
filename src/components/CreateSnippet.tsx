"use client";

import axiosInstance from "@/axios";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import { useRouter } from "next/navigation";

export default function CreateSnippet() {
  const router = useRouter();

  async function createSnippet() {
    // Create a new snippet
    try {
      const response = await axiosInstance.post("/snippet", {
        name: "Untitled",
        code: "// Write your code here",
      });

      router.push("/editor/" + response.data.id);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  return (
    <>
      <button
        onClick={createSnippet}
        className="order-2 md:order-1 w-full md:w-auto self-end mb-2 p-2 bg-blue-500 text-white"
      >
        Create Snippet
      </button>
    </>
  );
}
