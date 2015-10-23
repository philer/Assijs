var Assembler = (function() {
  
  "use strict";
  
  var argCount = 1;
  
  function Assembler(machine, ops) {
    this.machine = machine;
    this.operations = ops;
  }
  
  Assembler.prototype = {
    
    /**
     * Regex for labels.
     * For a line of the form "label: OP ARG"
     * it will return "label" at index 1 and "OP ARG" at index 2 (may be empty)
     * 
     * @type {RegExp}
     */
    labelRegex:   /^(\S+):\s*(.*)$/,
    
    /**
     * Comments start with ; or # and go all the way to the end of the line
     * 
     * @type {RegExp}
     */
    commentRegex: /[;#].*$/,
    
    
    parse: function(text) {
      var prog = []
        , addr = 0
        , labels = Object.create(null)
        , lines = this.getLines(text)
        ;
      
      for (var l = 0, len = lines.length ; l < len ; ++l) {
        var line = lines[l];
        
        // extract label
        var labelMatch = line.match(this.labelRegex);
        if (labelMatch) {
          labels[labelMatch[1]] = addr;
          line = labelMatch[2];
          continue;
        }
        
        // skip empty lines
        if (!line) continue;
        
        // process OP declaration
        var parts = lines[l].split(/\s+/)
          , name = parts.shift()
          , op = this.operations[name]
          ;
        
        if (!op) {
          throw new Assembler.ParseException("Operation " + name + " unknown on line " + (l + 1));
        }
        if (parts.length !== op.callback.length) {
          throw new Assembler.ParseException("Operation " + name + " expects " + op.callback.length + " arguments, " + parts.length + " given on line " + (l + 1));
        }
        
        prog[addr++] = this.operations[name].code;
        for (var a = 0/*, argCount = parts.length*/ ; a < argCount ; ++a) {
          prog[addr++] = parts[a] || 0;
        }
      }
      
      // resolve labels and cast strings to int
      prog = prog.map(function(val) {
        if ($.isNumeric(val)) {
          return +val;
        }
        if (labels[val] === undefined) {
          throw "label " + val + " is not defined";
        } else {
          return labels[val];
        }
      });
      
      return prog;
    },
    
    /**
     * split filecontents into an array of lines,
     * removing empty lines and comments after '#'
     * 
     * @param  {string} text
     * @return {array}           array of strings
     */
    getLines: function(text) {
      return text.split("\n").map(this.trimComments, this);
    },
    
    /**
     * Remove comments preceded by ";" and trims whitespace.
     * Comments do not have to start at the beginning of the line.
     * 
     * @param  {string} string
     * @return {string}
     */
    trimComments: function(string) {
      return string.replace(this.commentRegex, '').trim();
    },
  };
  
  
  Assembler.ParseException = Error;
  
  return Assembler;
  
})();
