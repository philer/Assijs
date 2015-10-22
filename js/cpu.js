var Cpu = (function($) {
  
  "use strict";
  
  function Cpu($cpu, mem, ops) {
    this.memory = mem;
    this.operations = Object.create(null);
    for (var op in ops) {
      if (ops.hasOwnProperty(op)) {
        this.operations[ops[op].code] = ops[op].callback;
      }
    }
    
    this.$cpu = $cpu;
    
    new MemoryCell(this, 'akku',      0);
    new MemoryCell(this, 'counter',   0);
    new MemoryCell(this, 'operation', 0);
    new MemoryCell(this, 'argument',  0);
    this.nFlag = new MemoryCell(null, 'nFlag',     false);
    this.zFlag = new MemoryCell(null, 'zFlag',     false);
  }
  
  Cpu.prototype = {
    
    run: function(prog) {
      if (prog !== undefined) {
        this.setProg(prog);
      }
      this.counter = 0;
      this.intervalId = setInterval(this.step.bind(this), 100);
    },
    
    step: function() {
      MemoryCell.clearHighlights();
      
      if (this.counter % 2) { // argument
        this.argument = this.prog[this.counter];
        
        var hold = this.operations[this.operation].call(this, this.argument);
        if (!this.zFlag.updated) {
          this.zFlag.set(false);
        }
        if (!this.nFlag.updated) {
          this.nFlag.set(false);
        }
        if (hold) {
          clearInterval(this.intervalId);
        }
      } else { // operator
        this.operation = this.prog[this.counter];
      }
      console.log(this.counter, this.operations[this.operation], this.argument, this.zFlag.get());
      ++this.counter;
    },
    
    setProg: function(prog) {
      this.prog = prog;
      this.memory.write(0, prog);
    },
    
    getMem: function(addr) {
      return this.memory.get(addr);
    },
    
    setMem: function(addr, val) {
      this.memory.set(addr, val);
    },
    
    setAkku: function(val) {
      this.akku = val;
      // this.$akku.text(val);
      return this;
    },
    
    getAkku: function() {
      return this.akku;
    },
    
  };
  
  /**
   * Simple camel case conversion function:
   * Removes anything that isn't a letter/digit and uppercases the following letter.
   * Does NOT handle weird utf-8 characters or whatever.
   * 
   * "foo bar" -> "fooBar"
   * "foo_bar" -> "fooBar"
   * "foo-bar" -> "fooBar"
   * @param {string}  str input
   * @return {string}     camel case version of input
   */
  function camelCase(str) {
    var parts = str.split(/[^A-Za-z0-9]+/),
      i = 0;
    str = parts[0];
    while (++i < parts.length) {
      str += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
    }
    return str;
  }
  
  
  return Cpu;
  
})(jQuery);
