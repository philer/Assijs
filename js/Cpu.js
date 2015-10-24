var Cpu = (function(eventsTrait, $) {
  
  "use strict";
  
  function Cpu($cpu, mem, ops, conf) {
    var _this = this;
    
    this.wordLength = conf.wordLength;
    
    this.memory = mem;
    
    this.operations = Object.create(null);
    for (var op in ops) {
      if (ops.hasOwnProperty(op)) {
        ops[op].name = op;
        this.operations[ops[op].code] = ops[op];
      }
    }
    
    this.log = [];
    this.running = false;
    this.delay = 0;
    this._step = -1;
    this.step  = this.step.bind(this);
    
    // this.$cpu = $cpu;
    this.registers = new Memory.Aggregate([
      this.accumulator = new Memory.Cell($('.accumulator', $cpu), this.wordLength, 0),
      this.counter     = new Memory.Cell($('.counter',     $cpu), this.wordLength, 0),
      this.operation   = new Memory.Cell($('.operation',   $cpu), this.wordLength, 0),
      this.argument    = new Memory.Cell($('.argument',    $cpu), this.wordLength, 0),
      this.nFlag = new Memory.BooleanCell($('#n-flag', $cpu), this.wordLength, false),
      this.zFlag = new Memory.BooleanCell($('#z-flag', $cpu), this.wordLength, false),
      this.vFlag = new Memory.BooleanCell($('#v-flag', $cpu), this.wordLength, false),
    ]);
    
    /**
     * Automatically set overflow flag according to new accumulator value
     * 
     * @param {int} val
     */
    this.accumulator.set = function(val) {
      if (val !== this.fixInt(val)) {
        _this.vFlag.set(true);
      }
      Memory.Cell.prototype.set.call(this, val);
    };
    
    // this.on       = $.fn.on.bind($this);
    // this.one      = $.fn.one.bind($this);
    // this._trigger = $.fn.trigger.bind($this);
    
    this._clearUpdated()._clearHighlights();
  }
  
  Cpu.prototype = eventsTrait({
    
    start: function() {
      this.running = setInterval(this.step, this.delay);
      return this;
    },
    
    stop: function() {
      clearInterval(this.running);
      this.running = false;
      this.trigger('hold');
      return this;
    },
    
    toggle: function() {
      return this.running ? this.stop() : this.start();
    },
    
    step: function(keepHighlights) {
      
      this._clearUpdated();
      if (!keepHighlights) {
        this._clearHighlights();
      }
      
      switch (this._step = (this._step + 1) % 4) {
        case 0:
          this.operation.set(this.memory.get(this.counter.get()));
          this.counter.increment();
          break;
          
        case 1:
          this.argument.set(this.memory.get(this.counter.get()));
          this.counter.increment();
          break;
          
        case 2:
          this._currentOperation = this.operations[this.operation.get()];
          if (this._currentOperation) {
            this.operation.set(this._currentOperation.name);
          } else {
            return this._fail('Unknown opcode ' + this.operation.get());
          }
          break;
          
        case 3:
          var hold = this._currentOperation.callback.call(this, this.argument.get());
          if (hold) {
            this.stop();
          } else {
            this._updateFlags();
          }
      }
      
      this.log.push(Memory.Cell.getUpdated().map(function(memcell) {
        return {
          memoryCell: memcell,
          before: memcell.oldValue,
          after: memcell.value,
        };
      }));
      
      return this;
    },
    
    opStep: function() {
      this.stop();
      this._clearHighlights();
      this.running = true;
      this.step(true);
      while (this.running && this._step !== 3) {
        this.step(true);
      }
      this.running = false;
    },
    
    fastForward: function() {
      this.stop();
      this._clearHighlights();
      this.running = true;
      while (this.running) {
        this.step(true);
      }
    },
    
    back: function(keepHighlights) {
      this.stop();
      this._clearUpdated();
      if (!keepHighlights) {
        this._clearHighlights();
      }
      
      this._step = (this._step + 3) % 4;
      var updatedMemory = this.log.pop();
      updatedMemory.map(function(update) {
        update.memoryCell.set(update.before);
      });
    },
    
    opBack: function() {
      this.stop();
      this._clearHighlights();
      this.back(true);
      while (this._step !== 3) {
        this.back(true);
      }
    },
    
    reset: function() {
      this.stop();
      this.accumulator.set(0);
      this.counter.set(0);
      this.operation.set(0);
      this.argument.set(0);
      this.nFlag.set(false);
      this.zFlag.set(false);
      this._step = -1;
      this.log = [];
      return this._clearUpdated()._clearHighlights();
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
    
    _clearUpdated: function() {
      this.registers.clearAccessed().clearUpdated();
      this.memory.clearAccessed().clearUpdated();
      return this;
    },
    
    _clearHighlights: function() {
      this.registers.clearHighlights();
      this.memory.clearHighlights();
      return this;
    },
    
    setSpeed: function(speed) {
      this.delay = 1000 - speed;
      if (this.running) {
        clearInterval(this.running);
        this.running = setInterval(this.step, this.delay);
      }
      return this;
    },
    
    _fail: function(msg) {
      $('.errors').text(msg);
      $('.cpu-playpause .fa').removeClass('fa-pause').addClass('fa-play');
      return this.stop();
    },
    
  });
  
  // Cpu.RuntimeException = Error;
  
  return Cpu;
  
})(eventsTrait, jQuery);
