"use client";
import axiosInstance from "@/axios";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateProject = () => {
  const router = useRouter();
  async function createProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name");
      const body = { name };

      if (!name) return;
      const response = await axiosInstance.post("/project", body);

      router.push(`/editor/${response.data.id}`);

      console.log(response.data);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  return (
    <form action="" onSubmit={createProject}>
      <input
        name="name"
        type="text"
        className="order-1 md:order-2 w-full md:w-auto self-end mb-2 p-2 border border-gray-300"
      />
      <button
        type="submit"
        className="order-2 md:order-1 w-full md:w-auto self-end mb-2 p-2 bg-blue-500 text-white"
      >
        Create Project
      </button>
    </form>
  );
};

export default CreateProject;
