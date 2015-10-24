EventsTrait = (function($) {
  
  "use strict";
  
  return function EventsTrait(proto) {
    
    return $.extend(proto, {
      
      on: function() {
        $.fn.on.apply(this.$this || (this.$this = $(this)), arguments);
        return this;
      },
      
      one: function() {
        $.fn.one.apply(this.$this || (this.$this = $(this)), arguments);
        return this;
      },
      
      trigger: function() {
        $.fn.trigger.apply(this.$this || (this.$this = $(this)), arguments);
        return this;
      },
      
    });
    
  };
  
})(jQuery);
