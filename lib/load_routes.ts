import { Router, Express } from "express";
import { getFiles, Methods, methods } from "./get_files";
import { conflictFinder } from "./conflict_finder";
import { routeLogger } from "./route_logger";

export function load(
  /**
   * Express app
   */
  app: Express,
  /**
   * Absolute path to the src directory
   * You need to use `path.join(__dirname, "you_source_directory")`
   */
  absolutePathToSrc: string,
  options: {
    /**
     * If true, logs list of routes
     * @default true
     */
    logger?: boolean;
    loadTime?: boolean
  } = { logger: true, loadTime: true }
) {
  const start = Date.now();
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
  if (options.loadTime) {
    console.log(`load time: ${Date.now() - start}ms`);
  }

}
