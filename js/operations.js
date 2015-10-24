var OPERATIONS = {
  
  // Controll
  
  HOLD: {
    code: 0,
    callback: function() {
      return true;
    },
  },
  
  JMP: {
    code: 1,
    callback: function(target) {
      this.counter.set(target);
    },
  },
  
  JMPZ: {
    code: 2,
    callback: function(target) {
      if (this.zFlag.get()) {
        this.counter.set(target);
      }
    },
  },
  
  JMPNZ: {
    code: 3,
    callback: function(target) {
      if (!this.zFlag.get()) {
        this.counter.set(target);
      }
    },
  },
  
  JMPN: {
    code: 4,
    callback: function(target) {
      if (this.nFlag.get()) {
        this.counter.set(target);
      }
    },
  },
  
  JMPNN: {
    code: 5,
    callback: function(target) {
      if (!this.nFlag.get()) {
        this.counter.set(target);
      }
    },
  },
  
  JMPP: {
    code: 6,
    callback: function(target) {
      if (!(this.zFlag.get() || this.nFlag.get())) {
        this.counter.set(target);
      }
    },
  },
  
  JMPNP: {
    code: 7,
    callback: function(target) {
      if (this.zFlag.get() || this.nFlag.get()) {
        this.counter.set(target);
      }
    },
  },
  
  JMPV: {
    code: 8,
    callback: function(target) {
      if (this.vFlag.get()) {
        this.counter.set(target);
      }
    },
  },
  
  // Memory
  
  LOAD: {
    code: 100,
    callback: function(addr) {
      this.accumulator.set(this.memory.get(addr));
    },
  },
  
  LOADI: {
    code: 101,
    callback: function(val) {
      this.accumulator.set(+val);
    },
  },
  
  STORE: {
    code: 102,
    callback: function(addr) {
      this.memory.set(addr, this.accumulator.get());
    },
  },
  
  // Logic
  
  CMP: {
    code: 201,
    callback: function(addr) {
      var mem = this.memory.get(addr)
        , akk = this.accumulator.get()
        ;
      if (akk === mem) {
        this.zFlag.set(true);
      } else if (akk < mem) {
        this.nFlag.set(true);
      }
    },
  },
  
  CMPI: {
    code: 202,
    callback: function(val) {
      var akk = this.accumulator.get();
      if (akk === val) {
        this.zFlag.set(true);
      } else if (akk < val) {
        this.nFlag.set(true);
      }
    },
  },
  
  // Math
  
  ADD: {
    code: 203,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() + this.memory.get(addr));
    },
    opString: function(addr) {
      // console.log(this.argument.get(), this.accumulator.get(), this.memory.get(this.argument.get()));
      return "acc := acc + mem[" + addr + "] = "
          + this.accumulator.get() + " + " + this.memory.get(addr)
          + " = " + (this.accumulator.get() + this.memory.get(addr))
          ;
    },
  },
  
  ADDI: {
    code: 204,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() + +val);
    },
  },
  
  SUB: {
    code: 205,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() - this.memory.get(addr));
    },
  },
  
  SUBI: {
    code: 206,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() - +val);
    },
  },
  
  MUL: {
    code: 207,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() * this.memory.get(addr));
    },
  },
  
  MULI: {
    code: 208,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() * +val);
    },
  },
  
  DIV: {
    code: 209,
    callback: function(addr) {
      this.accumulator.set(Math.floor(this.accumulator.get() / this.memory.get(addr)));
    },
  },
  
  DIVI: {
    code: 210,
    callback: function(val) {
      this.accumulator.set(Math.floor(this.accumulator.get() / +val));
    },
  },
  
  MOD: {
    code: 211,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() % this.memory.get(addr));
    },
  },
  
  MODI: {
    code: 212,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() % +val);
    },
  },
  
  // Bitwise
  
  AND: {
    code: 220,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() & this.memory.get(addr));
    },
  },
  
  ANDI: {
    code: 221,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() & +val);
    },
  },
  
  OR: {
    code: 222,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() | this.memory.get(addr));
    },
  },
  
  ORI: {
    code: 223,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() | +val);
    },
  },
  
  XOR: {
    code: 224,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() ^ this.memory.get(addr));
    },
  },
  
  XORI: {
    code: 225,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() ^ +val);
    },
  },
  
  NOT: {
    code: 226,
    callback: function() {
      this.accumulator.set(~this.accumulator.get());
    },
  },
  
  SHL: {
    code: 227,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() << this.memory.get(addr));
    },
  },
  
  SHLI: {
    code: 228,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() << +val);
    },
  },
  
  SHR: {
    code: 229,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() >>> this.memory.get(addr));
    },
  },
  
  SHRI: {
    code: 230,
    callback: function(val) {
      
      // The sign-propagating right shift >>> doesn't work by itself,
      // since we are chopping of bits to the left it is not propagating
      // the correct bit. To get the correct sign-propagation we first shift
      // everything to the far left, do our operation and then shift back.
      this.accumulator.set(
        this.accumulator.get()
          << 32 - this.wordLength
          >>> +val
          >> 32 - this.wordLength
      );
    },
  },
  
  SHRA: {
    code: 231,
    callback: function(addr) {
      this.accumulator.set(this.accumulator.get() >> this.memory.get(addr));
    },
  },
  
  SHRAI: {
    code: 232,
    callback: function(val) {
      this.accumulator.set(this.accumulator.get() >> +val);
    },
  },
  
};
