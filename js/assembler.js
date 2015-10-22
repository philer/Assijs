var Assembler = (function() {
  
  "use strict";
  
  var argCount = 1;
  
  function Assembler(machine, ops) {
    this.machine = machine;
    this.operations = ops;
  }
  
  Assembler.prototype = {
    
    commentRegex: /;.*$/,
    labelRegex:   /^\S+:$/,
    
    parse: function(text) {
      var prog = []
        , addr = 0
        , labels = Object.create(null)
        , lines = this.getLines(text)
        ;
      
      for (var l = 0, len = lines.length ; l < len ; ++l) {
        var line = lines[l];
        
        if (!line) continue;
        
        if (line.match(this.labelRegex)) {
          // labels[line.slice(0, -1)] = addr + 1;
          labels[line.slice(0, -1)] = addr;
          continue;
        }
        
        var parts = lines[l].split(/\s+/)
          , name = parts.shift()
          , op = this.operations[name]
          ;
        
        if (!op) {
          throw "Operation " + name + " unknown on line " + (l + 1);
        }
        if (parts.length !== op.callback.length) {
          throw "Operation " + name + " expects " + op.callback.length + " arguments, " + parts.length + " given on line " + (l + 1);
        }
        
        prog[addr++] = this.operations[name].code;
        for (var a = 0/*, argCount = parts.length*/ ; a < argCount ; ++a) {
          prog[addr++] = parts[a] || 0;
        }
        // prog[addr++] = {
        //   code: this.operations[name].code,
        //   args: parts,
        // }
      }
      
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
      console.log(prog);
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
  
  return Assembler;
  
})();
