import { Dispatch, SetStateAction, useState } from "react";
import TreeItem from "./TreeItem";

const FileFolderTree: React.FC<{
  items: IFileFolder[];
  setFiles: Dispatch<SetStateAction<IFileFolder[]>>;
  onFileSelect: (fileId: string, fileContent: string) => void;
}> = ({ items, setFiles, onFileSelect }) => {
  const [isHovering, setIsHovering] = useState("");
  return (
    <div className="p-4">
      {items.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          setFiles={setFiles}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

export default FileFolderTree;
