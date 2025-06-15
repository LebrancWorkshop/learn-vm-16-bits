import { ErrorLog } from "~/logs";

type Unit = "BYTE" | "KB" | "MB" | "GB" | "TB";

export const BYTESIZE = (size: number, unit: Unit): number => {
  switch(unit) {
    case "BYTE":
      return size;
    case "KB":
      return size * (2**10); // 1 KB = (2**10) Bytes = 1024 Bytes
    case "MB":
      return size * (2**20); // 1 MB = 1024 KB = (2**10) KB = (2**20) Bytes
    case "GB":
      return size * (2**30); // 1 GB = 1024 MB = (2**10) MB = (2**20) KB = (2**30) Bytes
    case "TB":
      return size * (2**40); // 1 TB = 1024 GB = (2**10) GB = (2**20) MB = (2**30) KB = (2**40) Bytes
    default:
      throw new Error(`[ERROR] ${ErrorLog.SIZE_UNIT_NOT_VALID}`);
  }
};
