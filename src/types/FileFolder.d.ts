interface IFileFolder {
  id: string;
  name: string;
  isFolder: boolean;
  content?: string;
  parentId?: string;
  parent?: FileFolder;
  children: FileFolder[];
  createdAt?: Date;
  updatedAt?: Date;
  projectId?: number;
  project?: Project;
  rootProject?: Project;
}
