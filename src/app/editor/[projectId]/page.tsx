"use client";

import axiosInstance from "@/axios";
import CodeEditor from "@/components/CodeEditor";
import FileFolderTree from "@/components/FileFolderTree";
import Tabs from "@/components/Tabs";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface PageProps {
  params: {
    projectId: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const [files, setFiles] = useState<IFileFolder[]>([]);

  const [name, setName] = useState("");

  const [activeFile, setActiveFile] = useState<IFileFolder | null>(null);
  const [openFiles, setOpenFiles] = useState<Set<IFileFolder>>(new Set());

  const updateFileContentById = (fileId: string, newContent: string) => {
    setFiles((currentFiles) => {
      const updateContent = (items: IFileFolder[]): IFileFolder[] => {
        return items.map((file) => {
          if (file.id === fileId) {
            return { ...file, content: newContent };
          } else if (file.isFolder) {
            return { ...file, children: updateContent(file.children) };
          } else {
            return file;
          }
        });
      };
      return updateContent(currentFiles);
    });
  };
  const onFileSelect = (file: IFileFolder) => {
    setActiveFile(file);
  };

  const getProject = async (id: string) => {
    const addIsSavedKey = (items: IFileFolder[]): IFileFolder[] => {
      return items.map((file) => {
        if (file.isFolder) {
          return { ...file, children: addIsSavedKey(file.children) };
        } else {
          file.isSaved = true;
          return file;
        }
      });
    };

    try {
      const response = await axiosInstance.get("/project/" + id);

      setName(response.data.name);

      const projectFiles = addIsSavedKey(response.data.rootFolder.children);

      setFiles(projectFiles);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  useEffect(() => {
    getProject(params.projectId);

    return () => {};
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold my-4">Code Editor</h1>
      <h1 className="text-xl font-semibold my-4">{name}</h1>
      <div className="flex">
        <aside className="w-1/4 bg-gray-700 p-4 text-white">
          <FileFolderTree
            items={files}
            setFiles={setFiles}
            onFileSelect={onFileSelect}
            setOpenFiles={setOpenFiles}
            projectId={params.projectId}
          />
        </aside>
        <div className="flex-1">
          {activeFile?.content && (
            <CodeEditor
              projectId={params.projectId}
              openFiles={openFiles}
              setOpenFiles={setOpenFiles}
              updateFileContent={(newContent) =>
                updateFileContentById(activeFile.id, newContent)
              }
              activeFile={activeFile as IFileFolder}
              setActiveFile={
                setActiveFile as Dispatch<SetStateAction<IFileFolder>>
              }
              onFileSelect={onFileSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
