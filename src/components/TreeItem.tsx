import axiosInstance from "@/axios";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";

interface TreeProps {
  item: IFileFolder;
  isHovering: string;
  setIsHovering: Dispatch<SetStateAction<string>>;
  setFiles: Dispatch<SetStateAction<Files>>;
  onFileSelect: (file: IFileFolder) => void;
  projectId: string;
}

const TreeItem: React.FC<TreeProps> = ({
  item,
  isHovering,
  setIsHovering,
  setFiles,
  onFileSelect,
  projectId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const toggle = () => setIsOpen(!isOpen);

  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setIsHovering(item.id);
    },
    [item.id, setIsHovering]
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
    },
    [setIsHovering]
  );

  const handleAddFileClick = () => {
    !isOpen && toggle();
    setIsAddingFile(true);
    setIsAddingFolder(false); // Ensure only one input is open
  };

  const handleAddFolderClick = () => {
    !isOpen && toggle();
    setIsAddingFolder(true);
    setIsAddingFile(false); // Ensure only one input is open
  };

  const handleNewItemNameChange = (e: any) => {
    setNewItemName(e.target.value);
  };

  const handleNewItemCreation = async (
    isFolder: boolean,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && newItemName.trim() !== "") {
      const newItem: IFileFolder = {
        id: Date.now().toString(),
        name: newItemName,
        isFolder: isFolder,
        parent: item.id,
        children: [],
      };

      try {
        const body = {
          name: newItemName,
          isFolder: isFolder,
          parentId: item.id,
        };

        const response = await axiosInstance.post(
          "/file-folder/" + projectId,
          body
        );

        addNewItem(item.id, newItem);
        setIsAddingFile(false);
        setIsAddingFolder(false);
        setNewItemName("");
      } catch (error) {}
    }
  };

  const addNewItem = (parentId: string | null, newItem: IFileFolder) => {
    const updateTree = (items: IFileFolder[]): IFileFolder[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return { ...item, children: [...item.children, newItem] };
        } else if (item.children && item.children.length > 0) {
          return { ...item, children: updateTree(item.children) };
        }
        return item;
      });
    };

    setFiles((currentFiles) => ({
      ...currentFiles,
      all: updateTree(currentFiles.all),
    }));
  };

  const handleFileClick = useCallback(() => {
    if (!item.isFolder) {
      setFiles((prevFiles) => {
        let duplicate = false;

        Array.from(prevFiles.open).forEach((file) => {
          if (file.id === item.id) {
            console.log("SA<EE");
            return (duplicate = true);
          }
        });

        if (duplicate) return prevFiles;

        const newOpenFiles = new Set(prevFiles.open);
        newOpenFiles.add(item);
        return { ...prevFiles, open: newOpenFiles };
      });
      onFileSelect(item);
    }
  }, [item, onFileSelect]);

  return (
    <div className="tree-item">
      <div className="flex justify-between items-center">
        {item.isFolder ? (
          <>
            <div
              onClick={toggle}
              className="cursor-pointer w-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isOpen ? "▼" : "►"} {item.name}
            </div>
            {isHovering === item.id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddFileClick()}
                  className="text-xs z-10"
                >
                  📄
                </button>
                <button
                  onClick={() => handleAddFolderClick()}
                  className="text-xs z-10"
                >
                  📁
                </button>
              </div>
            )}
          </>
        ) : (
          <span onClick={handleFileClick} className="cursor-pointer w-full">
            {item.name}
          </span>
        )}
      </div>
      {isOpen && item.isFolder && (
        <div className="pl-4">
          {isAddingFile && (
            <input
              type="text"
              autoFocus
              placeholder="File name"
              value={newItemName}
              onChange={handleNewItemNameChange}
              onKeyDown={(e) => handleNewItemCreation(false, e)}
              className="block w-full px-2 py-1 mb-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {isAddingFolder && (
            <input
              type="text"
              autoFocus
              placeholder="Folder name"
              value={newItemName}
              onChange={handleNewItemNameChange}
              onKeyDown={(e) => handleNewItemCreation(true, e)}
              className="block w-full px-2 py-1 mb-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {item.children.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              isHovering={isHovering}
              setIsHovering={setIsHovering}
              setFiles={setFiles}
              onFileSelect={onFileSelect}
              projectId={projectId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeItem;
