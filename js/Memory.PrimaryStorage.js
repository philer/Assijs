(function(Memory, Aggregate, $) {
  
  "use strict";
  
  function PrimaryStorage($elem, conf) {
    var lines = conf.memory.lines
      , cols = conf.memory.columns
      ;
    this.$thead = $("table > thead", $elem);
    this.$tbody = $("table > tbody", $elem);
    
    this.length = lines * cols;
    
    this.initUi(lines, cols);
    
    this.cells = new Array(this.length);
    for (var addr = this.length ; 0 <= --addr ;) {
      this.cells[addr] = new Memory.Cell('.memcell-' + addr, conf.wordLength, 0, true);
    }
    
  }
  
  PrimaryStorage.prototype = $.extend(Object.create(Aggregate.prototype), {
    
    initUi: function(lines, cols) {
      var addr, html, line, col;
      
      // table head
      html = '';
      for (col = 0 ; col < cols ; ++col) {
        html += '<th>+' + col + '</th>';
      }
      this.$thead.html('<tr><td></td>' + html + '</tr>');
      
      // table body
      html = '';
      addr = 0;
      for (line = 0 ; line < lines ; ++line) {
        html += '<tr><th>' + addr + '</th>';
        for (col = 0 ; col < cols ; ++col) {
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
    
  });
  
  Memory.PrimaryStorage = PrimaryStorage;
  
})(Memory, Memory.Aggregate, jQuery);
