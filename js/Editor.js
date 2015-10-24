var Editor = (function($, undefined) {
  
  "use strict";
  
  function Editor($elem) {
      this.$elem     = $elem;
      this.$gutter   = $('.editor-gutter',   $elem);
      this.$textarea = $('.editor-textarea', $elem);
      this.updateGutter();
      
      this.$textarea.on("input change paste", this.updateGutter.bind(this));
  }
  
  Editor.prototype = {
    
    save: function() {
      var blob = new Blob([this.getText()], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "assijs.txt");
    },
    
    getText: function() {
      return this.$textarea.html().replace('<br>', "\n");
    },
    
    getLines: function() {
      return this.$textarea.html().split(/\n|<br>/).slice(0, -1);
    },
    
    updateGutter: function() {
      var lines = this.countLines()
        , gutterHtml = ''
        ;
      for (var i = 1 ; i <= lines ; ++i) {
        gutterHtml += i + "\n";
      }
      this.$gutter.text(gutterHtml);
      this.$textarea.css('margin-left', this.$gutter.outerWidth());
      return this;
    },
    
    countLines: function() {
      // return (this.$textarea.html().match(/<br>/g) || [1]).length || 1;
      // return this.$textarea.html().match(/<br>/g).length;
      return this.getLines().length;
    },
    
  };
  
  return Editor;
  
})(jQuery);
