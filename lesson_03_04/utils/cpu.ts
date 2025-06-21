import { Memory } from "./memory";
import { REGISTERS, type Register } from "./register";
import { ErrorLog } from "~/logs";

import { Instruction } from "./instruction.enum";

export class CPU {

  memory: DataView;
  registers: DataView;
  registerMap: Map<Register, number>;
  stackFrameSize: number;

  constructor(memory: DataView) {
    this.memory = memory;
    this.registers = Memory.create(REGISTERS.length * 2);

    this.registerMap = new Map<Register, number>();
    REGISTERS.map((register: Register, index: number) => {
      this.registerMap.set(register, index * 2);
    })

    this.stackFrameSize = 0;
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

  // Stack Implementation
  push(value: number) {
    const stackPointer = this.getRegister("sp");
    this.memory.setUint16(stackPointer, value);
    const nextStackPointer = stackPointer - 2;
    this.setRegister("sp", nextStackPointer);
    this.stackFrameSize += 2;
  }

  pop() {
    const stackPointer = this.getRegister("sp");
    const popPointer = stackPointer + 2;
    this.setRegister("sp", popPointer);
    this.stackFrameSize -= 2;
    const returnValue = this.memory.getUint16(popPointer);
    return returnValue;
  }

  pushState() {
    this.push(this.getRegister("r1"));
    this.push(this.getRegister("r2"));
    this.push(this.getRegister("r3"));
    this.push(this.getRegister("r4"));
    this.push(this.getRegister("r5"));
    this.push(this.getRegister("r6"));
    this.push(this.getRegister("r7"));
    this.push(this.getRegister("ip"));
    this.push(this.stackFrameSize + 2);

    this.setRegister("fp", this.getRegister("sp"));

    this.stackFrameSize = 0; // Clear Stack Frame Size.
  }

  popState() {
    const framePointerAddress = this.getRegister("fp");
    this.setRegister("sp", framePointerAddress);

    this.stackFrameSize = this.pop();

    this.setRegister("ip", this.pop());
    this.setRegister("r8", this.pop());
    this.setRegister("r7", this.pop());
    this.setRegister("r6", this.pop());
    this.setRegister("r5", this.pop());
    this.setRegister("r4", this.pop());
    this.setRegister("r3", this.pop());
    this.setRegister("r2", this.pop());
    this.setRegister("r1", this.pop());

    const nArgs = this.pop();
    for(let i = 1; i <= nArgs; i++) {
      this.pop();
    }

    this.setRegister("fp", framePointerAddress + this.stackFrameSize);
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
      case Instruction.MOV_LIT_REG:
        const literal = this.fetch16();
        const registerIndex = this.fetch();
        this.registers.setUint16(registerIndex, literal);
        return;
      case Instruction.MOV_REG_REG:
        const registerFromIndex_MOV_REG_REG = this.fetch();
        const registerToIndex_MOV_REG_REG = this.fetch();
        const value_MOV_REG_REG = this.registers.getUint16(registerFromIndex_MOV_REG_REG);
        this.registers.setUint16(registerToIndex_MOV_REG_REG, value_MOV_REG_REG);
        return;
      case Instruction.MOV_REG_MEM:
        const registerFromIndex_MOV_REG_MEM = this.fetch();
        const memoryAddress_MOV_REG_MEM = this.fetch16();
        const value_MOV_REG_MEM = this.registers.getUint16(registerFromIndex_MOV_REG_MEM);
        this.memory.setUint16(memoryAddress_MOV_REG_MEM, value_MOV_REG_MEM);
        return;
      case Instruction.MOV_MEM_REG:
        const memoryAddress_MOV_MEM_REG = this.fetch16();
        const registerToIndex_MOV_MEM_REG = this.fetch();
        const value_MOV_MEM_REG = this.memory.getUint16(memoryAddress_MOV_MEM_REG);
        this.registers.setUint16(registerToIndex_MOV_MEM_REG, value_MOV_MEM_REG);
        return;
      case Instruction.ADD_REG_REG:
        const register_01 = this.fetch();
        const register_02 = this.fetch();
        const register_01_value = this.registers.getUint16(register_01);
        const register_02_value = this.registers.getUint16(register_02);
        const result = register_01_value + register_02_value;
        this.setRegister("acc", result);
        return;
      case Instruction.JMP_NOT_EQ:
        const value = this.fetch16();
        const address = this.fetch16();

        if(value !== this.getRegister("acc")) {
          this.setRegister("ip", address);
        }
        return;
      case Instruction.PSH_LIT:
        const literal_PSH_LIT = this.fetch16();
        this.push(literal_PSH_LIT);
        return;
      case Instruction.PSH_REG:
        const registerIndex_PSH_LIT = this.fetch();
        this.push(registerIndex_PSH_LIT);
        return;
      case Instruction.POP: // Pop and get the value, and set to assigned register.
        const registerIndex_POP = this.fetch();
        const returnValue_POP = this.pop();
        this.registers.setUint16(registerIndex_POP, returnValue_POP);
        return;
      case Instruction.CAL_LIT:
        return;
      case Instruction.CAL_REG:
        return;
      case Instruction.RET:
        this.popState();
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

  viewMemory(address: number, n: number = 8) {
    const nextNthBytes = Array.from({length: n}, (_, index: number) => this.memory.getUint8(address + index));
    const nextNthBytesFormat = nextNthBytes
      .map((byte: number) => `0x${byte.toString(16).padStart(2, "0")}`);

    console.log(`Address (0x${address.toString(16).padStart(4, "0")}): ${nextNthBytesFormat.join(' ')}`);
  }

};
