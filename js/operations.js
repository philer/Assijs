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
      this.counter.set(target - 1);
    },
  },
  
  JMPZ: {
    code: 2,
    callback: function(target) {
      if (this.zFlag.get()) {
        this.counter.set(target - 1);
      }
    },
  },
  
  JMPNZ: {
    code: 3,
    callback: function(target) {
      if (!this.zFlag.get()) {
        this.counter.set(target - 1);
      }
    },
  },
  
  JMPN: {
    code: 4,
    callback: function(target) {
      if (this.nFlag.get()) {
        this.counter.set(target - 1);
      }
    },
  },
  
  JMPNN: {
    code: 5,
    callback: function(target) {
      if (!this.nFlag.get()) {
        this.counter.set(target - 1);
      }
    },
  },
  
  JMPP: {
    code: 6,
    callback: function(target) {
      if (!(this.zFlag.get() || this.nFlag.get())) {
        this.counter.set(target - 1);
      }
    },
  },
  
  JMPNP: {
    code: 7,
    callback: function(target) {
      if (this.zFlag.get() || this.nFlag.get()) {
        this.counter.set(target - 1);
      }
    },
  },
  
  JMPV: {
    code: 8,
    callback: function(target) {
      if (this.vFlag.get()) {
        this.counter.set(target - 1);
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
  
};
