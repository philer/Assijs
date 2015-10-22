var Memory = (function($) {
  
  "use strict";
  
  function Memory($elem, lines, cols) {
    this.$thead = $("table > thead", $elem);
    this.$tbody = $("table > tbody", $elem);
    
    // this.mem = null;
    // this.$mem = null;
    this.length = lines * cols;
    // this.mem = new Array(this.length);
    
    this.initUi(lines, cols);
    
    for (var addr = this.length ; 0 <= --addr ;) {
      this[addr] = new MemoryCell(null, addr);
    }
    
  }
  
  Memory.prototype = {
    
    initUi: function(lines, cols) {
      var html = ''
        , addr = 0
        ;
      for (var line = 0 ; line < lines ; ++line) {
        html += '<tr><th>' + addr + '</th>';
        for (var col = 0 ; col < cols ; ++col) {
          html += '<td class="memcell memcell-' + addr + '">0</td>';
          ++addr;
        }
        html += '</tr>';
      }
      this.$tbody.html(html);
      this.$mem = $('.memory-cell', this.$tbody);
    },
    
    get: function(addr) {
      return this[addr].get();
    },
    
    set: function(addr, val) {
      this[addr].set(val, true);
      return this;
    },
    
    write: function(offset, values) {
      for (var i = 0, len = Math.min(values.length, this.length) ; i < len ; ++i) {
        this.set(offset + i, values[i]);
      }
    },
    
  };
  
  return Memory;
  
})(jQuery);
