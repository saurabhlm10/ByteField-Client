"use client";

import axiosInstance from "@/axios";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const getAllProjects = async () => {
    try {
      const response = await axiosInstance.get("/project");

      setProjects(response.data);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  useEffect(() => {
    getAllProjects();

    return () => {
      setProjects([]);
    };
  }, []);

  return (
    <div>
      {projects.map((project) => (
        <div
          onClick={() => router.push(`/editor/${project.id}`)}
          className="border border-gray-300 p-2 mb-2 cursor-pointer"
          key={project.id}
        >
          {project.name}
        </div>
      ))}
    </div>
  );
};

export default Page;
