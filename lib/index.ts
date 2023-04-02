const fs = require("fs");
const path = require("path");
const express = require("express");

const methods = ["get", "post", "put", "delete", "patch"];

// use a regex to rewrite isMethodPatternFile
function isMethodPatternFileRegex(absolute: string): boolean {
  return /.*\.(get|post|put|delete|patch)\.(js|ts)$/.test(absolute);
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
      if (absolute.endsWith("route.js") || absolute.endsWith("route.ts")) {
        const fileName = extractFileNameFromPath(absolute);
        const pathWithoutFileName = absolute.replace(fileName, "");
        const pathAfterSrc = pathWithoutFileName.split(baseDir)[1];
        files.push({ absolute, fileName, pathAfterSrc, type: "route" });
      } else if (isMethodPatternFileRegex(absolute)) {
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
          method,
        });
      }
    }
  }
  return files;
}

function extractFileNameFromPath(filePath: string): string {
  const fileName = filePath.split("/").pop();
  return fileName as string;
}
type RouterFileInfo = {
  absolute: string;
  fileName: string;
  pathAfterSrc: string;
  type?: string;
  method?: string;
};
export function loadRoutes(app: any, absolutePathToSrc: string) {
  const splittedPath = absolutePathToSrc.split("/");
  const baseDir = splittedPath[splittedPath.length - 1];
  let files: RouterFileInfo[] = [];
  getFilesRecursively(absolutePathToSrc, files, baseDir);

  const listOfRoutes: [string, string][] = [];
  files.forEach((file) => {
    const route = require(file.absolute);
    if (
      typeof route === "function" &&
      Object.getPrototypeOf(route) == express.Router
    ) {
      app.use(file.pathAfterSrc, route);
      listOfRoutes.push(["Router", `${file.pathAfterSrc}`]);
      return;
    }
    if (typeof route === "function" && file.method) {
      app[file.method](file.pathAfterSrc, route);
      const methodSymbol =
        file.method.toUpperCase() + " ".repeat(6 - file.method.length);
      listOfRoutes.push([methodSymbol, `${file.pathAfterSrc}`]);
      return;
    }
    if (typeof route === "object") {
      methods.forEach((method) => {
        if (route[method]) {
          app[method](file.pathAfterSrc, route[method]);
          const methodSymbol =
            method.toUpperCase() + " ".repeat(6 - method.length);
          listOfRoutes.push([methodSymbol, `${file.pathAfterSrc}`]);
        }
      });
      return;
    }
    if (typeof route === "function") {
      app.use(file.pathAfterSrc, route);
      listOfRoutes.push(["Router", `${file.pathAfterSrc}`]);
      return;
    }
    console.log('here:', typeof route, file.absolute, 'is not a valid route file')
  });
  listOfRoutes.forEach((route) => {
    const method = route[0];
    const path = route[1];
    if (method.indexOf("GET") > -1) {
      console.log("\x1b[32m%s\x1b[0m", method, path);
    } else if (method.indexOf("POST") > -1) {
      console.log("\x1b[33m%s\x1b[0m", method, path);
    } else if (method.indexOf("DELETE") > -1) {
      console.log("\x1b[31m%s\x1b[0m", method, path);
    } else if (method.indexOf("PATCH") > -1 || method.indexOf("PUT") > -1) {
      console.log("\x1b[35m%s\x1b[0m", method, path);
    } else {
      console.log(method, path);
    }
  });
};

console.log("Loading routes...");
