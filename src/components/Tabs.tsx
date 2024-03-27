import React, { Dispatch, FC, SetStateAction } from "react";

interface PageProps {
  fileTabs: Set<IFileFolder>;
  setOpenFiles: Dispatch<SetStateAction<Set<IFileFolder>>>;
  activeFile: IFileFolder;
  setActiveFile: Dispatch<SetStateAction<IFileFolder | null>>;
  onFileSelect: (file: IFileFolder) => void;
}

const Tabs: FC<PageProps> = ({
  fileTabs,
  setOpenFiles,
  activeFile,
  setActiveFile,
  onFileSelect,
}) => {
  return (
    <div className="flex w-full overflow-x-scroll">
      {Array.from(fileTabs).map((tab, index) => {
        return (
          <div
            key={index}
            className={`flex flex-row cursor-pointer items-center gap-2 text-sm px-2 py-1 border-t-[1px]  border-b-0" +
              ${
                tab.id === activeFile.id
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
                    setOpenFiles((prevOpenFiles) => {
                      const newOpenFiles = new Set(prevOpenFiles);
                      newOpenFiles.delete(tab);
                      setActiveFile(
                        newOpenFiles.size > 0
                          ? Array.from(newOpenFiles)[0]
                          : null
                      );
                      return newOpenFiles;
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
