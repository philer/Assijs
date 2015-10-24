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
    .setSpeed($('.cpu-speed').val())
    ;
  
  var assembler = new Assembler(cpu, ops);
  
  
  // editor UI
  
  var editor = new Editor($('.editor'));
  
  var $hiddenFileInput = $('.editor-open-file');
  $hiddenFileInput.change(function(evt) {
    editor.open(evt.target.files);
  });
  
  $('.editor-open').click(function(evt) {
    $hiddenFileInput.click();
  });
  
  $('.editor-save').click(editor.save.bind(editor));
  
  $('.editor-assemble').click(function() {
    var program;
    try {
      program = assembler.parseLines(editor.getLines());
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
  
  $('.cpu-reset').click(cpu.reset.bind(cpu));
  $('.cpu-op-step-backward').click(cpu.opBack.bind(cpu));
  $('.cpu-step-backward').click(cpu.back.bind(cpu));
  $('.cpu-step-forward').click(cpu.step.bind(cpu));
  $('.cpu-op-step-forward').click(cpu.opStep.bind(cpu));
  $('.cpu-fast-forward').click(cpu.fastForward.bind(cpu));
  
  $('.cpu-speed').change(function() {
    cpu.setSpeed(this.value);
  });
  
  
  // memory UI
  
  $('.memory-clear').click(function() {
    memory.clear();
  });
  
  $('.memory-base').change(function() {
    switch (this.value) {
      case "16": Memory.Cell.hex(); break;
      case  "2": Memory.Cell.bin(); break;
      default: Memory.Cell.setDisplayBase(10); break;
    }
  });
  $('.memory-base:checked').change();
  
  
})(jQuery, CONFIG, OPERATIONS);
