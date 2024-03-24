interface IFileFolder {
  id: string;
  name: string;
  isFolder: boolean;
  parent: string | null;
  content?: string;
  children: IFileFolder[];
}
