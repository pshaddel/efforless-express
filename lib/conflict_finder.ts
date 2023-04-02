import clc from "cli-color";
import { RouterFileInfo } from "./get_files";

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
