import { Dispatch, SetStateAction, useState } from "react";
import TreeItem from "./TreeItem";

const FileFolderTree: React.FC<{
  items: IFileFolder[];
  setFiles: Dispatch<SetStateAction<IFileFolder[]>>;
}> = ({ items, setFiles }) => {
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
        />
      ))}
    </div>
  );
};

export default FileFolderTree;
