interface IFileFolder {
  id: string;
  name: string;
  isFolder: boolean;
  parent: string | null;
  children: IFileFolder[];
}
