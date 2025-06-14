import { Memory } from "./memory";
import { REGISTERS, type Register } from "./register";
import { ErrorLog } from "~/logs";

export class CPU {

  memory: DataView;
  registers: DataView;
  registerMap: Map<Register, number>;

  constructor(size: number) {
    this.memory = Memory.create(size);
    this.registers = Memory.create(REGISTERS.length * 2);

    this.registerMap = new Map<Register, number>();
    REGISTERS.map((register: Register, index: number) => {
      this.registerMap.set(register, index * 2);
    })
  }

  // Set & Get Register Value.
  getRegister(registerName: Register) {
    if(!registerName) {
      throw new Error(`[ERROR] ${ErrorLog.REG_NOT_FOUND}\nRegister: ${registerName}`);
    }

    return this.registers.getUint16(this.registerMap.get(registerName) as number) ;
  };

  setRegister(registerName: Register, value: number) {
    if(!registerName) {
      throw new Error(`[ERROR] ${ErrorLog.REG_NOT_FOUND}\nRegister: ${registerName}`);
    }

    this.registers.setUint16(this.registerMap.get(registerName) as number, value);
  }

  // CPU Process
  fetch() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint8(nextInstructionAddress);
    this.setRegister("ip", nextInstructionAddress + 1);
    return instruction;
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint16(nextInstructionAddress);
    this.setRegister("ip", nextInstructionAddress + 2);
    return instruction;
  }

};
