(function($, conf, ops) {
  
  "use strict";
  
  // init
  
  var memory = new Memory.PrimaryStorage(
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
  
  
  // editor UI
  
  $('.assemble').click(function() {
    try {
      var program = assembler.parse($('.editor textarea').val());
    } catch (e) {
      if (e instanceof Assembler.ParseException) {
        $('.errors').text(e.message);
        return;
      } else {
        throw e;
      }
    }
    cpu.reset();
    memory.write(0, program);
  });
  
  
  // cpu UI
  
  var $cpuPlayPause     = $('.cpu-playpause')
    , $cpuPlayPauseIcon = $cpuPlayPause.find('.fa')
    ;
  $cpuPlayPause.click(function() {
    $cpuPlayPauseIcon.removeClass('fa-play').addClass('fa-pause');
    cpu.toggle();
  });
  $(cpu).on('hold', function() {
    $cpuPlayPauseIcon.removeClass('fa-pause').addClass('fa-play');
  });
  
  $('.cpu-step-forward').click(cpu.step.bind(cpu));
  
  $('.cpu-reset').click(cpu.reset.bind(cpu));
  
  $('.cpu-speed').change(function() {
    cpu.setSpeed(this.value);
  });
  
  
  // memory UI
  
  $('.memory-clear').click(function() {
    memory.clear();
  });
  
  $('.memory-dec').click(function() {
    MemoryCell.setDisplayBase(10);
    $('.memory-hex, .memory-bin').removeClass('active');
    $(this).addClass('active')
  });
  
  $('.memory-hex').click(function() {
    MemoryCell.hex();
    $('.memory-dec, .memory-bin').removeClass('active');
    $(this).addClass('active')
  });
  
  $('.memory-bin').click(function() {
    MemoryCell.bin();
    $('.memory-dec, .memory-hex').removeClass('active');
    $(this).addClass('active')
  });
  
})(jQuery, CONFIG, OPERATIONS);
