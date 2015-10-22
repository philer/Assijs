var MemoryCell = (function($, undefined) {
  
  "use strict";
  
  function MemoryCell($elem, wordLength, initValue, editable) {
    var _this = this;
    
    this.$elem = $elem instanceof $ ? $elem : $($elem);
    this.wordLength = wordLength;
    this.editable = editable === undefined || editable;
    
    this.set(initValue);
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
          .text(this.value)
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
      return int << this.wordLength >> this.wordLength;
    },
    
  };
  
  // static
  
  MemoryCell.updated = [];
  
  MemoryCell.clearHighlights = function() {
    this.updated.forEach(function(memcell) {
      memcell.updated = false;
      memcell.$elem.removeClass('updated');
    });
    this.updated = [];
  };
  
  return MemoryCell;
  
})(jQuery);
