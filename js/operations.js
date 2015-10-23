var OPERATIONS = {
  
  // Controll
  
  HOLD: {
    code: 00,
    callback: function() {
      return true;
    },
  },
  
  JMP: {
    code: 01,
    callback: function(target) {
      this.counter.set(target - 1);
    },
  },
  
  JMPZ: {
    code: 02,
    callback: function(target) {
      if (this.zFlag.get()) {
        this.counter.set(target - 1);
      }
    },
  },
  
  // Memory
  
  LOAD: {
    code: 100,
    callback: function(addr) {
      this.akku.set(this.memory.get(addr));
    },
  },
  
  LOADI: {
    code: 101,
    callback: function(val) {
      this.akku.set(+val);
    },
  },
  
  STORE: {
    code: 102,
    callback: function(addr) {
      this.memory.set(addr, this.akku.get());
    },
  },
  
  // Logic
  
  CMP: {
    code: 201,
    callback: function(addr) {
      var mem = this.memory.get(addr)
        , akk = this.akku.get()
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
      var akk = this.akku.get();
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
      this.akku.set(this.akku.get() + this.memory.get(addr));
    },
  },
  
  ADDI: {
    code: 204,
    callback: function(val) {
      this.akku.set(this.akku.get() + +val);
    },
  },
  
  SUB: {
    code: 205,
    callback: function(addr) {
      this.akku.set(this.akku.get() - this.memory.get(addr));
    },
  },
  
  SUBI: {
    code: 206,
    callback: function(val) {
      this.akku.set(this.akku.get() - +val);
    },
  },
  
  MUL: {
    code: 207,
    callback: function(addr) {
      this.akku.set(this.akku.get() * this.memory.get(addr));
    },
  },
  
  MULI: {
    code: 208,
    callback: function(val) {
      this.akku.set(this.akku.get() * +val);
    },
  },
  
  DIV: {
    code: 209,
    callback: function(addr) {
      this.akku.set(Math.floor(this.akku.get() / this.memory.get(addr)));
    },
  },
  
  DIVI: {
    code: 210,
    callback: function(val) {
      this.akku.set(Math.floor(this.akku.get() / +val));
    },
  },
  
  MOD: {
    code: 211,
    callback: function(addr) {
      this.akku.set(this.akku.get() % this.memory.get(addr));
    },
  },
  
  MODI: {
    code: 212,
    callback: function(val) {
      this.akku.set(this.akku.get() % +val);
    },
  },
  
};
