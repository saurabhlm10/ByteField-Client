"use client";

import axiosInstance from "@/axios";
import CodeEditor from "@/components/CodeEditor";
import FileFolderTree from "@/components/FileFolderTree";
import { apiErrorHandler } from "@/utils/api-error-handler.util";
import React, { FC, useEffect, useState } from "react";

interface PageProps {
  params: {
    projectId: string;
  };
}

// const initialFiles = [
//   {
//     id: "1",
//     name: "Folder 1",
//     isFolder: true,
//     parent: null,
//     children: [
//       {
//         id: "1-2",
//         name: "Folder 1-2",
//         isFolder: true,
//         parent: "1",
//         children: [
//           {
//             id: "1-2-3",
//             name: "Folder 1-2-3",
//             isFolder: true,
//             parent: "1-2",
//             children: [
//               {
//                 id: "1-2-3-4",
//                 name: "Folder 1-2-3-4",
//                 isFolder: true,
//                 parent: "1-2-3",
//                 children: [
//                   {
//                     id: "1-2-3-4-5",
//                     name: "Folder 1-2-3-4-5",
//                     isFolder: true,
//                     parent: "1-2-3-4",
//                     children: [
//                       {
//                         id: "1-2-3-4-5-6",
//                         name: "Folder 1-2-3-4-5-6",
//                         isFolder: true,
//                         parent: "1-2-3-4-5",
//                         children: [
//                           {
//                             id: "1-2-3-4-5-6-7",
//                             name: "Folder 1-2-3-4-5-6-7",
//                             isFolder: true,
//                             parent: "1-2-3-4-5-6",
//                             children: [
//                               {
//                                 id: "1-2-3-4-5-6-7-8",
//                                 name: "Folder 1-2-3-4-5-6-7-8",
//                                 isFolder: true,
//                                 parent: "1-2-3-4-5-6-7",
//                                 children: [
//                                   {
//                                     id: "1-2-3-4-5-6-7-8-9",
//                                     name: "Folder 1-2-3-4-5-6-7-8-9",
//                                     isFolder: true,
//                                     parent: "1-2-3-4-5-6-7-8",
//                                     children: [
//                                       {
//                                         id: "1-2-3-4-5-6-7-8-9-10",
//                                         name: "Folder 1-2-3-4-5-6-7-8-9-10",
//                                         isFolder: true,
//                                         parent: "1-2-3-4-5-6-7-8-9",
//                                         children: [],
//                                       },
//                                     ],
//                                   },
//                                 ],
//                               },
//                             ],
//                           },
//                         ],
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "1-file",
//         name: "File 1-file",
//         isFolder: false,
//         parent: "1",
//         children: [],
//         content: `function helloWorld() {
//   console.log('Hello, world!');
// }`,
//       },
//     ],
//   },
// ];

const Page: FC<PageProps> = ({ params }) => {
  const [files, setFiles] = useState<IFileFolder[]>([]);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const [currentFileId, setCurrentFileId] = useState("");

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

  const onFileSelect = (fileId: string, fileContent: string) => {
    setCurrentFileId(fileId);
    setCode(fileContent);
  };

  const getProject = async (id: string) => {
    try {
      const response = await axiosInstance.get("/project/" + id);

      setName(response.data.name);

      setFiles([response.data.rootFolder] as IFileFolder[]);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  useEffect(() => {
    getProject(params.projectId);

    return () => {
      setCode("");
    };
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
            projectId={params.projectId}
          />
        </aside>
        <div className="flex-1">
          {code && (
            <CodeEditor
              code={code}
              setCode={setCode}
              projectId={params.projectId}
              updateFileContent={(newContent) =>
                updateFileContentById(currentFileId, newContent)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;