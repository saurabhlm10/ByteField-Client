interface Project {
  id: number;
  name: string;
  rootFolderId?: string;
  folders: FileFolder[];
}
