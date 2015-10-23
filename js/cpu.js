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
    
    this.program = [];
    
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
    
    run: function(program) {
      if (program !== undefined) {
        this.setProgram(program);
      }
      return this.reset().start();
    },
    
    step: function() {
      MemoryCell.clearHighlights();
      
      if (this.counter.get() % 2) { // argument
        this.argument.set(this.memory.get(this.counter.get()));
        
        var op = this.operations[this.operation.get()];
        
        if (!op) {
          return this._fail('Unknown opcode ' + this.operation.get());
          // throw new Cpu.RuntimeException('Unknown opcode ' + this.operation.get());
        }
        
        var hold = op.call(this, this.argument.get());
        
        if (!this.zFlag.updated) {
          this.zFlag.set(false);
        }
        if (!this.nFlag.updated) {
          this.nFlag.set(false);
        }
        if (hold) {
          this.stop();
        }
      } else { // operator
        this.operation.set(this.memory.get(this.counter.get()));
      }
      this.counter.increment();
      return this;
    },
    
    toggle: function() {
      return this.intervalId ? this.stop() : this.start();
    },
    
    start: function() {
      this.intervalId = setInterval(this.step, this.delay);
      return this;
    },
    
    stop: function() {
      clearInterval(this.intervalId);
      this.intervalId = false;
      return this;
    },
    
    reset: function() {
      this.stop();
      this.akku.set(0);
      this.counter.set(0);
      this.operation.set(0);
      this.argument.set(0);
      this.nFlag.set(false);
      this.zFlag.set(false);
      MemoryCell.clearHighlights();
      return this;
    },
    
    setProgram: function(program) {
      MemoryCell.clearHighlights();
      // this.program = program;
      this.memory.write(0, program);
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
    
    _fail: function(msg) {
      $('.errors').text(msg);
      $('.cpu-playpause .fa').removeClass('fa-pause').addClass('fa-play');
      return this.stop();
    },
    
  };
  
  // Cpu.RuntimeException = Error;
  
  return Cpu;
  
})(jQuery);
