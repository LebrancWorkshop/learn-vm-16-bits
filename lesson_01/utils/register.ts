export const REGISTERS = [
  "ip", "acc",
  "r1", "r2", "r3", "r4",
  "r5", "r6", "r7", "r8"
] as const;

export type Register = typeof REGISTERS[number];
