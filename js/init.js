(function($, conf, ops) {
  
  "use strict";
  
  var cpu = new Cpu(
      $('.cpu')
    , new Memory($('.memory'), conf.memory.lines, conf.memory.columns)
    , ops
  );
  
  var assembler = new Assembler(cpu, ops);
  
  var prog = $('.editor textarea').text();
  
  var program = assembler.parse(prog);
  
  cpu.run(program);
  
})(jQuery, CONFIG, OPERATIONS);
