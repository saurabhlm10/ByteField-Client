import { useState } from "react";
import TreeItem from "./TreeItem";

const FileFolderTree: React.FC<{
  items: IFileFolder[];
  addNewItem: (parentId: string | null, newItem: IFileFolder) => void;
}> = ({ items, addNewItem }) => {
  const [isHovering, setIsHovering] = useState("");
  return (
    <div className="p-4">
      {items.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          addNewItem={addNewItem}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
        />
      ))}
    </div>
  );
};

export default FileFolderTree;
