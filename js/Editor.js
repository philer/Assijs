var Editor = (function($, undefined) {
  
  "use strict";
  
  var brRegex = /<br\/?>(?:<\/br>)?|<\/div><div>/g
    , breakRegex = /\n|<br\/?>(?:<\/br>)?/
    ;
  
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
      saveAs(blob, "assijs.asm");
    },
    
    open: function(files) {
      var _this = this
        , reader = new FileReader()
        ;
      reader.addEventListener('load', function() {
        _this.setText(reader.result);
      });
      reader.readAsText(files[0]);
    },
    
    setText: function(text) {
      this.$textarea.text(text);
      return this.updateGutter();
    },
    
    getText: function() {
      
      // weird hack: css pre apparently hides the last linebreak
      var text = this.$textarea.html().replace(brRegex, "\n");
      if (text.charAt(text.length - 1) === "\n") {
        text = text.slice(0, -1);
      }
      return text;
    },
    
    getLines: function() {
      return this.getText().split("\n");
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
