import {
  CPU,
  Memory,
  Instruction
} from "~/utils";

import { CPU_SETTING } from "~/constants";

function vm() {
  const memorySize = CPU_SETTING.memorySize;
  const memory = Memory.create(memorySize);
  const cpu = new CPU(memory);

  const R1 = cpu.registerMap.get("r1") as number;
  const R2 = cpu.registerMap.get("r2") as number;

  const writeableRAM = new Uint8Array(memory.buffer);
  const assemblers: (number | Instruction)[] = [
    Instruction.MOV_LIT_REG,
    0x00,
    0x01, // 0x0001
    R1,

    Instruction.MOV_LIT_REG,
    0x00,
    0x09, // 0x0009
    R2,

    Instruction.ADD_REG_REG,
    R1,
    R2
  ];

  assemblers.map((assemble: number, index: number) => {
    writeableRAM[index] = assemble;
  })

  cpu.viewMemory(0x0000);
  cpu.debug();

  cpu.step();
  cpu.debug();

  cpu.step();
  cpu.debug();

  cpu.step();
  cpu.debug();
};

export default vm;
