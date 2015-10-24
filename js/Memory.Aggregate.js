(function(Memory, $, undefined) {
  
  "use strict";
  
  function Aggregate(cells) {
    this.cells = Array.isArray(cells) ? cells : [];
  }
  
  Aggregate.prototype = {
    
    add: function(cell, dontCheck) {
      if (dontCheck || 0 > this.cells.indexOf(cell)) {
        this.cells.push(cell);
      }
      return this;
    },
    
    remove: function(cell) {
      var i = this.cells.indexOf(cell);
      if (0 <= i) {
        this.cells.splice(i, 1);
      }
      return this;
    },
    
    clear: function() {
      this.cells = [];
      return this;
    },
    
    copy: function() {
      return new Aggregate(this.all());
    },
    
    each: function(fn) {
      for (var i = 0, len = this.cells.length ; i < len ; ++i) {
        fn.call(this, this.cells[i]);
      }
      return this;
    },
    
    map: function(fn) {
      var results = new Array(this.cells.length);
      for (var i = 0, len = this.cells.length ; i < len ; ++i) {
        results[i] = fn.call(this, this.cells[i]);
      }
      return results;
    },
    
    all: function() {
      return this.cells.slice();
    },
    
    
    getAccessed: function() {
      return new Aggregate(this.cells.filter(function(cell) {
        return cell.accessed;
      }));
    },
    
    getUpdated: function() {
      return new Aggregate(this.cells.filter(function(cell) {
        return cell.updated;
      }));
    },
    
    clearAccessed: function() {
      this.getAccessed().each(function(cell) {
        cell.accessed = false;
      });
      return this;
    },
    
    clearUpdated: function() {
      this.getUpdated().each(function(cell) {
        cell.updated = false;
      });
      return this;
    },
    
    clearHighlights: function() {
      this.each(function(cell) {
        cell.clearHighlights();
      });
    },
    
  };
  
  Memory.Aggregate = Aggregate;
  
})(Memory, jQuery);
