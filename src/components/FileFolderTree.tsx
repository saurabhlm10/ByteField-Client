import { Dispatch, SetStateAction, useState } from "react";
import TreeItem from "./TreeItem";

const FileFolderTree: React.FC<{
  items: Files;
  onFileSelect: (file: IFileFolder) => void;
  setFiles: Dispatch<SetStateAction<Files>>;
  projectId: string;
}> = ({ items, setFiles, onFileSelect, projectId }) => {
  const [isHovering, setIsHovering] = useState("");
  return (
    <div className="p-4">
      {items.all.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          setFiles={setFiles}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          onFileSelect={onFileSelect}
          projectId={projectId}
        />
      ))}
    </div>
  );
};

export default FileFolderTree;
