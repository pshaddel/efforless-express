const fs = require("fs");
const path = require("path");
const express = require("express");

const methods = ["get", "post", "put", "delete", "patch"];

function isMethodPatternFile(absolute) {
  return (
    absolute.endsWith("get.js") ||
    absolute.endsWith("get.ts") ||
    absolute.endsWith("post.js") ||
    absolute.endsWith("post.ts") ||
    absolute.endsWith("put.js") ||
    absolute.endsWith("put.ts") ||
    absolute.endsWith("delete.js") ||
    absolute.endsWith("delete.ts") ||
    absolute.endsWith("patch.js") ||
    absolute.endsWith("patch.ts")
  );
}
function getFilesRecursively(directory, files, baseDir) {
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
      } else if (isMethodPatternFile(absolute)) {
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

function extractFileNameFromPath(filePath) {
  const fileName = filePath.split("/").pop();
  return fileName;
}

module.exports.loadRoutes = function (app, absolutePathToSrc) {
  const splittedPath = absolutePathToSrc.split("/");
  const baseDir = splittedPath[splittedPath.length - 1];
  let files = [];
  getFilesRecursively(absolutePathToSrc, files, baseDir);

  const listOfRoutes = [];
  files.forEach((file) => {
    const route = require(file.absolute);
    if (
      typeof route === "function" &&
      Object.getPrototypeOf(route) == express.Router
    ) {
      app.use(file.pathAfterSrc, route);
      listOfRoutes.push(["Router", `${file.pathAfterSrc}`]);
      // console.log(`Router ${file.pathAfterSrc}`);
      return;
    }
    if (typeof route === "function" && file.method) {
      app[file.method](file.pathAfterSrc, route);
      const methodSymbol =
        file.method.toUpperCase() + " ".repeat(6 - file.method.length);
      listOfRoutes.push([methodSymbol, `${file.pathAfterSrc}`]);
      // console.log(`${methodSymbol} ${file.pathAfterSrc}`);
      return;
    }
    if (typeof route === "object") {
      methods.forEach((method) => {
        if (route[method]) {
          app[method](file.pathAfterSrc, route[method]);
          const methodSymbol =
            method.toUpperCase() + " ".repeat(6 - method.length);
          listOfRoutes.push([methodSymbol, `${file.pathAfterSrc}`]);
          // console.log(`${methodSymbol} ${file.pathAfterSrc}`);
        }
      });
    }
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
