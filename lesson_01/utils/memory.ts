import { ErrorLog } from "~/logs";

export class Memory {
  static create(size: number): DataView {
    if(size < 0) {
      throw new Error(`[ERROR] ${ErrorLog.MEM_LESS_ZERO}`);
    }

    const memoryBuffer = new ArrayBuffer(size);
    const memoryData = new DataView(memoryBuffer);

    return memoryData;
  }
};
