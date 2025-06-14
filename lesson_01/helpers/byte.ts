import { ErrorLog } from "~/logs";

type Unit = "BYTE" | "KB" | "MB" | "GB" | "TB";

export const BYTESIZE = (size: number, unit: Unit): number => {
  switch(unit) {
    case "BYTE":
      return size;
    case "KB":
      return size * (2**10);
    case "MB":
      return size * (2**20);
    case "GB":
      return size * (2**30);
    case "TB":
      return size * (2**40);
    default:
      throw new Error(`[ERROR] ${ErrorLog.SIZE_UNIT_NOT_VALID}`);
  }
};
