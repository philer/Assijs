(function(Memory, Cell, $) {
  
  "use strict";
  
  function BooleanCell() {
    Cell.apply(this, arguments);
  }
  
  BooleanCell.prototype = $.extend(Object.create(Cell.prototype), {
    
    _updateView: function() {
      this.$elem.addClass('updated')[0].checked = this.value;
    },
    
  });
  
  Memory.BooleanCell = BooleanCell;
  
})(Memory, Memory.Cell, jQuery);
