(function(Memory, $, undefined) {
  
  "use strict";
  
  function Cell($elem, wordLength, initValue, editable) {
    var _this = this;
    
    this.$elem = $elem instanceof $ ? $elem : $($elem);
    this.wordLength = wordLength;
    this.intStrLen = wordLength / Cell._intBaseLog2;
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
    instances.add(this, true);
  }
  
  Cell.prototype = {
    
    get: function() {
      // accessed.add(this);
      this.accessed = true;
      this.$elem.addClass('accessed');
      return this.value;
    },
    
    set: function(val, force) {
      if (this.value !== val || force) {
        this.oldValue = this.value;
        this.value = $.isNumeric(val) ? this.fixInt(val) : val;
        this.updated = true;
        // updated.add(this);
        // this.trigger('updated');
        this._updateView();
      }      
    },
    
    _updateView: function() {
      this.$elem
          .text($.isNumeric(this.value) ? this.formatInt(+this.value) : this.value)
          .addClass('updated')
          ;
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
  
  
  // // private static
  var instances = new Memory.Aggregate()
  //   , accessed  = new Memory.Aggregate()
  //   , updated   = new Memory.Aggregate()
    ;
  
  
  // public static
  $.extend(Cell, {
    
    getUpdated: function() {
      return instances.getUpdated();
    },
    
    // getUpdated: function() {
    //   return updated.copy();
    // },
    
    // clearAccessed: function() {
    //   accessed.each(function(cell) {
    //       cell.accessed = false;
    //       cell.$elem.removeClass('accessed');
    //     })
    //     .clear();
    //   return this;
    // },
    
    // clearUpdated: function() {
    //   updated.each(function(cell) {
    //       cell.updated = false;
    //       cell.$elem.removeClass('updated');
    //     })
    //     .clear();
    //   return this;
    // },
    
    hex: function(prefix) {
      return this.setDisplayBase(16, prefix || '0x', false);
    },
    
    bin: function(prefix) {
      return this.setDisplayBase(2, true, true, 4);
    },
    
    /**
     * If prefix is provided (or just true)
     * integers will be padded to their max length
     * 
     * A note on calculating the length:
     * For a given base b, the maximum length of a n-bit integer is
     * log_b(2^n) = log_2(2^n) / log_2(b) = n / log_2(b)
     * Since the length of integers (n) may vary for instances
     * only the result of log_2(b) is cached in Cell._intBaseLog2.
     * 
     * @param {int}    base
     * @param {string} prefix optional
     */
    setDisplayBase: function(base, prefix, unsigned, chunkLength) {
      
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
      instances.each(function(cell) {
        cell.intStrLen = Math.ceil(cell.wordLength / Cell._intBaseLog2);
        cell.$elem.text(
          $.isNumeric(cell.value) ? cell.formatInt(cell.value) : cell.value
        );
      });
      
      return this;
    },
  
  });
  
  
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
  
  Memory.Cell = Cell.setDisplayBase(10);
  
})(Memory, jQuery);
