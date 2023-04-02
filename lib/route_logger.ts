import clc from "cli-color";
import { Methods } from "./get_files";

export function routeLogger(
  listOfRoutes: [string, string, Methods | "Router"][]
) {
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
