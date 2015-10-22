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
      this.counter = target - 1;
    },
  },
  
  JMPZ: {
    code: 501,
    callback: function(target) {
      if (this.zFlag.get()) {
        this.counter = target - 1;
      }
    },
  },
  
  // Memory
  
  LOAD: {
    code: 901,
    callback: function(addr) {
      this.setAkku(this.getMem(addr));
    },
  },
  
  LOADI: {
    code: 902,
    callback: function(val) {
      this.setAkku(+val);
    },
  },
  
  STORE: {
    code: 903,
    callback: function(addr) {
      this.setMem(addr, this.getAkku());
    },
  },
  
  // Logic
  
  CMP: {
    code: 400,
    callback: function(addr) {
      var mem = this.getMem(addr)
        , akk = this.getAkku()
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
      var akk = this.getAkku();
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
      this.setAkku(this.getAkku() + this.getMem(addr));
    },
  },
  
  ADDI: {
    code: 905,
    callback: function(val) {
      this.setAkku(this.getAkku() + +val);
    },
  },
  
  SUB: {
    code: 906,
    callback: function(addr) {
      this.setAkku(this.getAkku() - this.getMem(addr));
    },
  },
  
  SUBI: {
    code: 907,
    callback: function(val) {
      this.setAkku(this.getAkku() - +val);
    },
  },
  
  MUL: {
    code: 908,
    callback: function(addr) {
      this.setAkku(this.getAkku() * this.getMem(addr));
    },
  },
  
  MULI: {
    code: 909,
    callback: function(val) {
      this.setAkku(this.getAkku() * +val);
    },
  },
  
  DIV: {
    code: 910,
    callback: function(addr) {
      this.setAkku(Math.floor(this.getAkku() / this.getMem(addr)));
    },
  },
  
  DIVI: {
    code: 911,
    callback: function(val) {
      this.setAkku(Math.floor(this.getAkku() / +val));
    },
  },
  
  MOD: {
    code: 912,
    callback: function(addr) {
      this.setAkku(this.getAkku() % this.getMem(addr));
    },
  },
  
  MODI: {
    code: 913,
    callback: function(val) {
      this.setAkku(this.getAkku() % +val);
    },
  },
  
};
