var OPERATIONS = {
  
  // Controll
  
  HOLD: {
    code: 900,
    callback: function() {
      return true;
    },
  },
  
  JMP: {
    code: 500,
    callback: function(target) {
      this.counter.set(target - 1);
    },
  },
  
  JMPZ: {
    code: 501,
    callback: function(target) {
      if (this.zFlag.get()) {
        this.counter.set(target - 1);
      }
    },
  },
  
  // Memory
  
  LOAD: {
    code: 901,
    callback: function(addr) {
      this.akku.set(this.memory.get(addr));
    },
  },
  
  LOADI: {
    code: 902,
    callback: function(val) {
      this.akku.set(+val);
    },
  },
  
  STORE: {
    code: 903,
    callback: function(addr) {
      this.memory.set(addr, this.akku.get());
    },
  },
  
  // Logic
  
  CMP: {
    code: 400,
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
    code: 401,
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
    code: 904,
    callback: function(addr) {
      this.akku.set(this.akku.get() + this.memory.get(addr));
    },
  },
  
  ADDI: {
    code: 905,
    callback: function(val) {
      this.akku.set(this.akku.get() + +val);
    },
  },
  
  SUB: {
    code: 906,
    callback: function(addr) {
      this.akku.set(this.akku.get() - this.memory.get(addr));
    },
  },
  
  SUBI: {
    code: 907,
    callback: function(val) {
      this.akku.set(this.akku.get() - +val);
    },
  },
  
  MUL: {
    code: 908,
    callback: function(addr) {
      this.akku.set(this.akku.get() * this.memory.get(addr));
    },
  },
  
  MULI: {
    code: 909,
    callback: function(val) {
      this.akku.set(this.akku.get() * +val);
    },
  },
  
  DIV: {
    code: 910,
    callback: function(addr) {
      this.akku.set(Math.floor(this.akku.get() / this.memory.get(addr)));
    },
  },
  
  DIVI: {
    code: 911,
    callback: function(val) {
      this.akku.set(Math.floor(this.akku.get() / +val));
    },
  },
  
  MOD: {
    code: 912,
    callback: function(addr) {
      this.akku.set(this.akku.get() % this.memory.get(addr));
    },
  },
  
  MODI: {
    code: 913,
    callback: function(val) {
      this.akku.set(this.akku.get() % +val);
    },
  },
  
};
