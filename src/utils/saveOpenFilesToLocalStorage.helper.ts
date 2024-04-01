import lodash from "lodash";
import React from "react";

export interface OpenFilesRef {
  active: IFileFolder | null;
  open: Set<IFileFolder>;
}

export function saveOpenFilesToLocalStorage(
  openFilesRef: React.RefObject<OpenFilesRef>
) {
  const tempOpenFiles = {
    active: openFilesRef.current?.active,
    open: openFilesRef.current ? Array.from(openFilesRef.current.open) : [],
  };
  const currentOpenFiles = JSON.parse(
    localStorage.getItem("openFiles") || "{}"
  );

  if (lodash.isEqual(tempOpenFiles, currentOpenFiles)) {
    return;
  }

  localStorage.setItem("openFiles", JSON.stringify(tempOpenFiles));
}
