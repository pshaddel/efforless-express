import fs from "fs";
import path from "path";

export const methods = ["get", "post", "put", "delete", "patch"] as const;
export type Methods = typeof methods[number];

function isRouteMethod(absolute: string): boolean {
  return /.*\.(get|post|put|delete|patch)\.(js|ts)$/.test(absolute);
}

function isRoute(str: string, pattern: string = "route"): boolean {
  return new RegExp(`.*\.${pattern}\.(js|ts)$`).test(str);
}
function getFilesRecursively(
  directory: string,
  files: RouterFileInfo[],
  baseDir: string
) {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute, files, baseDir);
    } else {
      if (isRoute(absolute)) {
        const fileName = extractFileNameFromPath(absolute);
        const pathWithoutFileName = absolute.replace(fileName, "");
        const pathAfterSrc = pathWithoutFileName.split(baseDir)[1];
        files.push({ absolute, fileName, pathAfterSrc, type: "route" });
      } else if (isRouteMethod(absolute)) {
        const fileName = extractFileNameFromPath(absolute);
        const pathWithoutFileName = absolute.replace(fileName, "");
        const pathAfterSrc = pathWithoutFileName.split("src")[1];
        const splitted = fileName.split(".");
        const method = splitted[splitted.length - 2];
        files.push({
          absolute,
          fileName,
          pathAfterSrc,
          type: "file",
          method: method as Methods,
        });
      }
    }
  }
  return files;
}
export function getFiles(absolutePathToSrc: string) {
  const splittedPath = absolutePathToSrc.split("/");
  const baseDir = splittedPath[splittedPath.length - 1];
  let files: RouterFileInfo[] = [];
  getFilesRecursively(absolutePathToSrc, files, baseDir);
  return files;
}
function extractFileNameFromPath(filePath: string): string {
  const fileName = filePath.split("/").pop();
  return fileName as string;
}
export type RouterFileInfo = {
  absolute: string;
  fileName: string;
  pathAfterSrc: string;
  type?: string;
  method?: Methods;
};
