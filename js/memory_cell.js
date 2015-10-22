var MemoryCell = (function($) {
  
  "use strict";
  
  function MemoryCell(parent, name, initValue, editable) {
    var _this = this;
    
    this.$elem = $('.memcell-' + name);
    this.name = name;
    this.editable = editable === undefined || editable;
    
    if (parent) {
      Object.defineProperty(parent, name, {
        get: this.get.bind(this), //function() { return _this.get(); },
        set: this.set.bind(this), //function(val) { return _this.set(val); },
        enumerable: true,
        configurable: true,
      });
    }
    
    this.set(initValue);
  }
  
  MemoryCell.updated = [];
  
  MemoryCell.clearHighlights = function() {
    // $(this.updated).removeClass('updated');
    this.updated.forEach(function(memcell) {
      memcell.updated = false;
      memcell.$elem.removeClass('updated');
    });
    this.updated = [];
  };
  
  MemoryCell.prototype = {
    
    get: function() {
      return this.value;
    },
    
    set: function(val, force) {
      if (this.value !== val || force) {
        this.value = val;
        this.updated = true;
        MemoryCell.updated.push(this);
        this.$elem
          .text(val)
          .addClass('updated')
          ;
      }      
    },
    
  };

  /**
   * Simple camel case conversion function:
   * Removes anything that isn't a letter/digit and uppercases the following letter.
   * Does NOT handle weird utf-8 characters or whatever.
   * 
   * "foo bar" -> "fooBar"
   * "foo_bar" -> "fooBar"
   * "foo-bar" -> "fooBar"
   * @param {string}  str input
   * @return {string}     camel case version of input
   */
  function camelCase(str) {
    var parts = str.split(/[^A-Za-z0-9]+/),
      i = 0;
    str = parts[0];
    while (++i < parts.length) {
      str += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
    }
    return str;
  }
  
  return MemoryCell;
  
})(jQuery);
