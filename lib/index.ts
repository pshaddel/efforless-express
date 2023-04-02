import fs from "fs";
import path from "path";
import { Router, Express } from "express";
import clc from "cli-color";

const methods = ["get", "post", "put", "delete", "patch"] as const;
type Methods = typeof methods[number];
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

function extractFileNameFromPath(filePath: string): string {
  const fileName = filePath.split("/").pop();
  return fileName as string;
}
type RouterFileInfo = {
  absolute: string;
  fileName: string;
  pathAfterSrc: string;
  type?: string;
  method?: Methods;
};

function getFiles(absolutePathToSrc: string) {
  const splittedPath = absolutePathToSrc.split("/");
  const baseDir = splittedPath[splittedPath.length - 1];
  let files: RouterFileInfo[] = [];
  getFilesRecursively(absolutePathToSrc, files, baseDir);
  return files;
}

export function loadRoutes(
  app: Express,
  absolutePathToSrc: string,
  options: {
    logger?: boolean;
  } = { logger: true }
) {
  const files = getFiles(absolutePathToSrc);

  const listOfRoutes: [string, string, Methods | "Router"][] = [];

  conflictFinder(files);

  files.forEach((file) => {
    const route = require(file.absolute);
    if (typeof route === "function" && Object.getPrototypeOf(route) == Router) {
      app.use(file.pathAfterSrc, route);
      listOfRoutes.push(["Router", `${file.pathAfterSrc}`, "Router"]);
      return;
    }
    if (typeof route === "function" && file.method) {
      app[file.method](file.pathAfterSrc, route);
      const methodSymbol =
        file.method.toUpperCase() + " ".repeat(6 - file.method.length);
      listOfRoutes.push([methodSymbol, `${file.pathAfterSrc}`, file.method]);
      return;
    }
    if (typeof route === "object") {
      methods.forEach((method) => {
        if (route[method]) {
          app[method](file.pathAfterSrc, route[method]);
          const methodSymbol =
            method.toUpperCase() + " ".repeat(6 - method.length);
          listOfRoutes.push([methodSymbol, `${file.pathAfterSrc}`, method]);
        }
      });
      return;
    }
    if (typeof route === "function") {
      app.use(file.pathAfterSrc, route);
      listOfRoutes.push(["Router", `${file.pathAfterSrc}`, "Router"]);
      return;
    }
    console.log("Could not load this Route: ", file.absolute);
  });

  if (options.logger) {
    routeLogger(listOfRoutes);
  }
}

function routeLogger(listOfRoutes: [string, string, Methods | "Router"][]) {
  const logArray: string[] = ["List of Routes:\n"];
  listOfRoutes.forEach((route) => {
    const color = methodColor(route[2]);
    const method = clc[color](route[0]);
    const path = route[1];
    logArray.push(method, path, "\n");
  });
  console.log(...logArray);
}

function methodColor(method: Methods | "Router") {
  switch (method) {
    case "get":
      return "green";
    case "post":
      return "yellow";
    case "delete":
      return "red";
    case "patch":
      return "magenta";
    case "put":
      return "magenta";
    case "Router":
      return "cyan";
    default:
      return "white";
  }
}

export function conflictFinder(files: RouterFileInfo[]) {
  const routes = files.filter((file) => file.type === "route");
  const filesWithMethods = files.filter((file) => file.method);
  routes.forEach((route) => {
    filesWithMethods.forEach((file) => {
      if (route.pathAfterSrc === file.pathAfterSrc) {
        throw new Error(
          `Conflict found between these files: \n${clc.red(
            route.absolute
          )}\n${clc.yellow(file.absolute)}\nYou cannot have a ${clc.red(
            "route"
          )} file and a ${clc.yellow("method route")} in the same directory.
          `
        );
      }
    });
  });
}
