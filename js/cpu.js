var Cpu = (function($, undefined) {
  
  "use strict";
  
  function Cpu($cpu, mem, ops, conf) {
    var _this = this
      , $this = $(this)
      ;
    
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
    this.accumulator = new MemoryCell($('.accumulator',      $cpu), conf.wordLength, 0);
    this.counter     = new MemoryCell($('.counter',   $cpu), conf.wordLength, 0);
    this.operation   = new MemoryCell($('.operation', $cpu), conf.wordLength, 0);
    this.argument    = new MemoryCell($('.argument',  $cpu), conf.wordLength, 0);
    this.nFlag       = new MemoryCell($('.n-flag',    $cpu), conf.wordLength, false);
    this.zFlag       = new MemoryCell($('.z-flag',    $cpu), conf.wordLength, false);
    this.vFlag       = new MemoryCell($('.v-flag',    $cpu), conf.wordLength, false);
    
    /**
     * Automatically set overflow flag according to new accumulator value
     * 
     * @param {int} val
     */
    this.accumulator.set = function(val) {
      if (val !== this.fixInt(val)) {
        _this.vFlag.set(true);
      }
      MemoryCell.prototype.set.call(this, val);
    };
    
    this.on       = $.fn.on.bind($this);
    this.one      = $.fn.one.bind($this);
    this._trigger = $.fn.trigger.bind($this);
    
    MemoryCell.clearHighlights();
  }
  
  Cpu.prototype = {
    
    start: function() {
      this.intervalId = setInterval(this.step, this.delay);
      return this;
    },
    
    stop: function() {
      clearInterval(this.intervalId);
      this.intervalId = false;
      this._trigger('hold');
      return this;
    },
    
    toggle: function() {
      return this.intervalId ? this.stop() : this.start();
    },
    
    step: function() {
      if (this.counter.get() % 2) { // argument -> execute operation
        
        // microstep 2
        this.argument.set(this.memory.get(this.counter.get()));
        
        MemoryCell.clearHighlights();
        
        // microstep 3
        var op = this.operations[this.operation.get()];
        
        if (!op) {
          return this._fail('Unknown opcode ' + this.operation.get());
          // throw new Cpu.RuntimeException('Unknown opcode ' + this.operation.get());
        }
        
        // microstep 4
        var hold = op.call(this, this.argument.get());
        
        if (hold) {
          this.stop();
        } else {
          
          // microstep 5
          this._updateFlags();
        }
        
      } else { // operator
        
        // microstep 1
        this.operation.set(this.memory.get(this.counter.get()));
      }
      this.counter.increment();
      return this;
    },
    
    /**
     * Reset all flags that have not been updated
     */
    _updateFlags: function() {
      if (!this.accumulator.get()) {
        this.zFlag.set(true);
      } else if (!this.zFlag.updated) {
        this.zFlag.set(false);
      }
      
      if (this.accumulator.get() < 0) {
        this.nFlag.set(true);
      } else if (!this.nFlag.updated) {
        this.nFlag.set(false);
      }
      
      if (!this.vFlag.updated) {
        this.vFlag.set(false);
      }
      return this;
    },
    
    reset: function() {
      this.stop();
      this.accumulator.set(0);
      this.counter.set(0);
      this.operation.set(0);
      this.argument.set(0);
      this.nFlag.set(false);
      this.zFlag.set(false);
      MemoryCell.clearHighlights();
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
