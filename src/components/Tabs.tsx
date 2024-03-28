import React, { Dispatch, FC, SetStateAction } from "react";

interface PageProps {
  fileTabs: Set<IFileFolder>;
  files: Files;
  setFiles: Dispatch<SetStateAction<Files>>;
  onFileSelect: (file: IFileFolder) => void;
}

const Tabs: FC<PageProps> = ({ fileTabs, files, setFiles, onFileSelect }) => {
  console.log(fileTabs);
  return (
    <div className="flex w-full overflow-x-scroll">
      {Array.from(fileTabs).map((tab, index) => {
        return (
          <div
            key={index}
            className={`flex flex-row cursor-pointer items-center gap-2 text-sm px-2 py-1 border-t-[1px]  border-b-0" +
              ${
                tab.id === files.active?.id
                  ? "bg-[#1E1E1E] border-t-blue-300"
                  : "bg-slate-800 border-t-transparent"
              }`}
          >
            <p
              onClick={() => {
                onFileSelect(tab);
              }}
            >
              {tab.name}
            </p>
            <div className="h-4 w-4 grid place-items-center bg-transparent hover:bg-slate-600 rounded-sm">
              {!tab.isSaved ? (
                <div className={`h-2 w-2 rounded-full ${"bg-white"} `}></div>
              ) : (
                <p
                  className="leading-3"
                  onClick={() => {
                    setFiles((prevFiles) => {
                      const newOpenFiles = new Set(prevFiles.open);
                      newOpenFiles.delete(tab);
                      const activeFile =
                        newOpenFiles.size > 0
                          ? Array.from(newOpenFiles)[0]
                          : null;
                      return {
                        ...prevFiles,
                        active: activeFile,
                        open: newOpenFiles,
                      };
                    });
                  }}
                >
                  &#x2715;
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
