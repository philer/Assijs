var Cpu = (function($, undefined) {
  
  "use strict";
  
  function Cpu($cpu, mem, ops, conf) {
    this.memory = mem;
    
    this.operations = Object.create(null);
    for (var op in ops) {
      if (ops.hasOwnProperty(op)) {
        this.operations[ops[op].code] = ops[op].callback;
      }
    }
    
    // this.maxInt = 1 << (this.wordLength - 1);
    // this.intMask = -1 << this.wordLength
    
    this.delay = 0;
    this.step = this.step.bind(this);
    
    // this.$cpu = $cpu;
    this.akku      = new MemoryCell($('.akku',      $cpu), conf.wordLength, 0);
    this.counter   = new MemoryCell($('.counter',   $cpu), conf.wordLength, 0);
    this.operation = new MemoryCell($('.operation', $cpu), conf.wordLength, 0);
    this.argument  = new MemoryCell($('.argument',  $cpu), conf.wordLength, 0);
    this.nFlag     = new MemoryCell($('.n-flag',    $cpu), conf.wordLength, false);
    this.zFlag     = new MemoryCell($('.z-flag',    $cpu), conf.wordLength, false);
    
    MemoryCell.clearHighlights();
  }
  
  Cpu.prototype = {
    
    run: function(prog) {
      if (prog !== undefined) {
        this.setProgram(prog);
      }
      this.counter.set(0);
      this.intervalId = setInterval(this.step, this.delay);
    },
    
    step: function() {
      MemoryCell.clearHighlights();
      
      if (this.counter.get() % 2) { // argument
        this.argument.set(this.prog[this.counter.get()]);
        
        var hold = this.operations[this.operation.get()].call(this, this.argument.get());
        if (!this.zFlag.updated) {
          this.zFlag.set(false);
        }
        if (!this.nFlag.updated) {
          this.nFlag.set(false);
        }
        if (hold) {
          clearInterval(this.intervalId);
          this.intervalId = false;
        }
      } else { // operator
        this.operation.set(this.prog[this.counter.get()]);
      }
      this.counter.increment();
    },
    
    setProgram: function(prog) {
      MemoryCell.clearHighlights();
      this.prog = prog;
      this.memory.write(0, prog);
      return this;
    },
    
    setSpeed: function(speed) {
      this.delay = 1000 - speed;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.step, this.delay);
      }
      return this;
    },
    
  };
  
  return Cpu;
  
})(jQuery);
