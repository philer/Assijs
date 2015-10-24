var OpLog = (function($, undefined) {
  
  "use strict";
  
  function OpLog() {
    this.items = [];
  }
  
  OpLog.prototype = {
    
    push: function(op, updatedMemory) {
      this.items.push(new OpLogItem)
    },
    
    pop: function() {
      return this.items.pop();
    },
    
  };
  
  function OpLogItem(op, updatedMemory) {
    this.operation = op;
    this.updated = updatedMemory.map(function(memcell) {
      return {
        memoryCell: memcell,
        before:     memcell.oldValue,
        after:      memcell.value,
      };
    });
  }
  
  return OpLog;
  
})(jQuery);
