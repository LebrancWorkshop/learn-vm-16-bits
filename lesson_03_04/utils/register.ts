export const REGISTERS = [
  "ip", "acc", // ip => Instruction Pointer, acc => Accumulator
  "r1", "r2", "r3", "r4", // r1 - r8 => General-Purpose Registers
  "r5", "r6", "r7", "r8",
  "sp", "fp" // sp => Stack Pointer, fp => Frame Pointer
] as const;

export type Register = typeof REGISTERS[number];
