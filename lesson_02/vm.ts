import {
  CPU,
  Memory,
  Instruction
} from "~/utils";

import { readLine } from "./helpers/readline";

import { CPU_SETTING } from "~/constants";

function vm() {
  const memorySize = CPU_SETTING.memorySize;
  const memory = Memory.create(memorySize);
  const cpu = new CPU(memory);

  const R1 = cpu.registerMap.get("r1") as number;
  const R2 = cpu.registerMap.get("r2") as number;
  const ACC = cpu.registerMap.get("acc") as number;

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
    R2,

    Instruction.MOV_REG_MEM,
    ACC,
    0x01,
    0x00, // Memory Address: 0x0100

    Instruction.JMP_NOT_EQ,
    0x00,
    0x03, // Value: 0x0000
    0x00,
    0x00 // Memory Address that set to Instruction Pointer (IP)
  ];

  assemblers.map((assemble: number, index: number) => {
    writeableRAM[index] = assemble;
  })


  readLine.on("line", () => {
    cpu.viewMemory(0x0100);
    cpu.viewMemory(cpu.getRegister("ip"));
    cpu.debug();
    cpu.step();
  });
};

export default vm;
