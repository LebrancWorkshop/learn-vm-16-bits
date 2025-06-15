import { Memory } from "./memory";
import { REGISTERS, type Register } from "./register";
import { ErrorLog } from "~/logs";

import { Instruction } from "./instruction";

export class CPU {

  memory: DataView;
  registers: DataView;
  registerMap: Map<Register, number>;

  constructor(memory: DataView) {
    this.memory = memory;
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

  execute(instruction: Instruction) {
    switch(instruction) {
      case Instruction.MOV_LIT_R1:
        const literal_01 = this.fetch16();
        this.setRegister("r1", literal_01);
        return;
      case Instruction.MOV_LIT_R2:
        const literal_02 = this.fetch16();
        this.setRegister("r2", literal_02);
        return;
      case Instruction.ADD_REG_REG:
        const register_01 = this.fetch();
        const register_02 = this.fetch();
        const register_01_value = this.registers.getUint16(register_01);
        const register_02_value = this.registers.getUint16(register_02);
        const result = register_01_value + register_02_value;
        this.setRegister("acc", result);
        return;
      default:
        return;
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }

  debug() {
    REGISTERS.forEach((register: Register) => {
      console.log(`${register}: 0x${this.getRegister(register).toString(16).padStart(4, "0")}`);
    })
    console.log(`=====================`);
  }

};
