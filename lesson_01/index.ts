import {
  CPU,
  Memory
} from "./utils";

import { CPU_SETTING } from "~/constants";

const cpuMemorySize = CPU_SETTING.memorySize;
const cpu = new CPU(cpuMemorySize);
