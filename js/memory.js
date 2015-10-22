var Memory = (function($) {
  
  "use strict";
  
  function Memory($elem, conf) {
    var lines = conf.memory.lines
      , cols = conf.memory.columns
      ;
    // this.$thead = $("table > thead", $elem);
    this.$tbody = $("table > tbody", $elem);
    
    this.length = lines * cols;
    
    this.initUi(lines, cols);
    
    this.cells = new Array(this.length);
    for (var addr = this.length ; 0 <= --addr ;) {
      this.cells[addr] = new MemoryCell('.memcell-' + addr, conf.wordLength, 0);
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
      // this.$mem = $('.memory-cell', this.$tbody);
    },
    
    get: function(addr) {
      if (this.cells[addr]) {
        return this.cells[addr].get();
      } else {
        throw "Invalid memory address " + addr;
      }
    },
    
    set: function(addr, val) {
      if (this.cells[addr]) {
        this.cells[addr].set(val, true);
      } else {
        throw "Invalid memory address " + addr;
      }
      return this;
    },
    
    write: function(offset, values) {
      for (var i = 0, len = values.length ; i < len ; ++i) {
        this.set(offset + i, values[i]);
      }
    },
    
    clear: function() {
      for (var i = 0, len = this.length ; i < len ; ++i) {
        this.set(i, 0);
      }
    }
    
  };
  
  return Memory;
  
})(jQuery);
