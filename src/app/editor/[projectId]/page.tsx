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
  useRef,
  useState,
} from "react";
import lodash from "lodash";

interface PageProps {
  params: {
    projectId: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const [name, setName] = useState("");

  const [files, setFiles] = useState<Files>({
    active: null,
    open: new Set(),
    all: [],
  });
  const openFilesRef = useRef({ active: files.active, open: files.open });

  function saveOpenFilesToLocalStorage() {
    return setInterval(() => {
      const tempOpenFiles = {
        active: openFilesRef.current.active,
        open: Array.from(openFilesRef.current.open),
      };
      const currentOpenFiles = JSON.parse(
        localStorage.getItem("openFiles") || "{}"
      );

      if (lodash.isEqual(tempOpenFiles, currentOpenFiles)) {
        return;
      }

      localStorage.setItem("openFiles", JSON.stringify(tempOpenFiles));
    }, 5000);
  }

  const getOpenFilesFromLocalStorage = () => {
    const rawOpenFiles = localStorage.getItem("openFiles");
    if (rawOpenFiles) {
      const openFiles = JSON.parse(rawOpenFiles);
      const activeFiles = openFiles.active;
      const openFilesSet: Set<IFileFolder> = new Set(openFiles.open);

      setFiles((prevFiles) => ({
        ...prevFiles,
        active: activeFiles,
        open: openFilesSet,
      }));
    }
  };

  const updateFileContentById = (fileId: string, newContent: string) => {
    setFiles((currentFiles) => {
      const updateContent = (items: IFileFolder[]): IFileFolder[] => {
        return items.map((file) => {
          if (file.id === fileId) {
            const updatedFile = { ...file, content: newContent };
            return { ...file, content: newContent };
          } else if (file.isFolder) {
            return { ...file, children: updateContent(file.children) };
          } else {
            return { ...file };
          }
        });
      };
      return {
        ...currentFiles,
        all: updateContent(currentFiles.all),
      };
    });
  };
  const onFileSelect = (file: IFileFolder) => {
    setFiles((prevFiles) => ({ ...prevFiles, active: file }));
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

      setFiles((prevFiles) => ({ ...prevFiles, all: projectFiles }));
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  useEffect(() => {
    const saveOpenFilesToLocalStorageInterval = saveOpenFilesToLocalStorage();
    getProject(params.projectId).then(() => {
      getOpenFilesFromLocalStorage();
    });

    return () => {
      clearInterval(saveOpenFilesToLocalStorageInterval);
    };
  }, []);

  useEffect(() => {
    openFilesRef.current = { active: files.active, open: files.open };
  }, [files]);

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
            projectId={params.projectId}
          />
        </aside>
        <div className="flex-1">
          {files.active?.content && (
            <CodeEditor
              projectId={params.projectId}
              files={files}
              setFiles={setFiles}
              updateFileContent={(newContent) =>
                updateFileContentById(files.active?.id as string, newContent)
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
