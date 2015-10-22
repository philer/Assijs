(function($, conf, ops) {
  
  "use strict";
  
  var memory = new Memory(
      $('.memory')
    , conf
  );
  
  var cpu = new Cpu(
      $('.cpu')
    , memory
    , ops
    , conf
  )
    .setSpeed($('input.speed').val())
    ;
  
  var assembler = new Assembler(cpu, ops);
  
  $('button.assemble').click(function() {
    cpu.setProgram(assembler.parse($('.editor textarea').text()));
  });
  
  $('button.playpause').click(function() {
    // cpu.run(assembler.parse($('.editor textarea').text()));
    cpu.run();
  });
  
  $('input.speed').change(function() {
    cpu.setSpeed(this.value);
  });
  
  $('button.memory-clear').click(function() {
    memory.clear();
  });
  
})(jQuery, CONFIG, OPERATIONS);
