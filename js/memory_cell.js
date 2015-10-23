var MemoryCell = (function($, undefined) {
  
  "use strict";
  
  function MemoryCell($elem, wordLength, initValue, editable) {
    var _this = this;
    
    this.$elem = $elem instanceof $ ? $elem : $($elem);
    this.wordLength = wordLength;
    this.intStrLen = wordLength / MemoryCell._intBaseLog2;
    // this.editable = editable === undefined || editable;
    // if (this.editable) {
    //   this.$elem
    //     .attr("contenteditable", true)
    //     .on("DOMSubtreeModified", function(evt) {
    //       _this.set(_this.$elem.text());
    //     });
    //   ;
    // }
    
    this.set(initValue);
    MemoryCell.instances.push(this);
  }
  
  MemoryCell.prototype = {
    
    get: function() {
      return this.value;
    },
    
    set: function(val, force) {
      if (this.value !== val || force) {
        this.value = $.isNumeric(val) ? this.fixInt(val) : val;
        this.updated = true;
        MemoryCell.updated.push(this);
        this.$elem
          .text($.isNumeric(this.value) ? this.formatInt(this.value) : this.value)
          .addClass('updated')
          ;
      }      
    },
    
    increment: function(amount) {
      this.set(this.get() + (amount === undefined ? 1 : amount));
    },
    
    decrement: function(amount) {
      this.increment(-amount);
    },
    
    fixInt: function(int) {
      
      // JS converts to 32bit int when bit shifting.
      // We simulate n bit integers by chopping off overflow
      // by shifting left by n and back again
      return int << 32 - this.wordLength >> 32 - this.wordLength;
    },
    
  };
  
  // static
  
  MemoryCell.instances = [];
  MemoryCell.updated = [];
  
  MemoryCell.clearHighlights = function() {
    this.updated.forEach(function(memcell) {
      memcell.updated = false;
      memcell.$elem.removeClass('updated');
    });
    this.updated = [];
  };
  
  MemoryCell.hex = function(prefix) {
    return this.setDisplayBase(16, prefix || '0x', false);
  }
  
  MemoryCell.bin = function(prefix) {
    return this.setDisplayBase(2, true, true, 4);
  }
  
  /**
   * If prefix is provided (or just true)
   * integers will be padded to their max length
   * 
   * A note on calculating the length:
   * For a given base b, the maximum length of a n-bit integer is
   * log_b(2^n) = log_2(2^n) / log_2(b) = n / log_2(b)
   * Since the length of integers (n) may vary for instances
   * only the result of log_2(b) is cached in MemoryCell._intBaseLog2.
   * 
   * @param {int}    base
   * @param {string} prefix optional
   */
  MemoryCell.setDisplayBase = function(base, prefix, unsigned, chunkLength) {
    
    // The function is created via the Function constructor since there are
    // a lot of possible cases and it has to be efficient since it may get
    // called many times in loops.
    // We're building the function as a single expresion to look like the
    // following in the most complicated case:
    // 
    // (n < 0 ? '-' : '') +
    //   prefix +
    //     (padding +
    //       (n >>> 0).toString(base)
    //     ).slice(-this.intStrLen)
    //   .match(chunkRegex).join(' ')
    
    var expr = (unsigned ? "(n>>>0)" : "(n<0?-n:n)")
             + ".toString(" + +base + ")";
          
    if (prefix) {
      expr = "('" + '0'.repeat(31) + "'+" + expr + ").slice(-this.intStrLen)";
      if (typeof prefix === "string") {
        expr = "'" + prefix + "'+" + expr;
      }
    }
    if (chunkLength) {
      expr += ".match(/.{1," + +chunkLength + "}/g).join(' ')";
    }
    if (!unsigned) {
      expr = "(n<0?'-':'')+" + expr;
    }
    
    this.prototype.formatInt = new Function("n", "return " + expr);
    
    this._intBaseLog2 = log2(base);
    
    // update instances (views)
    this.instances.forEach(function(mc) {
      mc.intStrLen = Math.ceil(mc.wordLength / MemoryCell._intBaseLog2);
      mc.$elem.text(
        $.isNumeric(mc.value) ? mc.formatInt(mc.value) : mc.value
      );
    });
    
    return this;
  };
  
  /**
   * Math.log2 is ES6 and might not be available.
   * 
   * @param  {int} n
   * @return {int}
   */
  function log2(n) {
    for (var log = 0 ; n >>= 1 ; ++log);
    return log;
  }
  
  return MemoryCell.setDisplayBase(10);
  
})(jQuery);
