define(
  ['jquery', 'core/core', 'core/utils', 
   'core/maths', 'core/entities/particle', 
   'core/entities/components'], 
  function($, core, utils, maths, Particle, Components) {
    function Editor() {
      this.init = function() {
        console.log('keking');
        if (particle != undefined) {
          this.particle = particle;
          this.particle['name'] += '.';
          this.particle['mass'] += 10;
          $('h1').remove();
          $('div.hidden').toggleClass('hidden');

          for (key in this.particle) {
            $('tbody').append( $('<tr></tr>').append( $('<td></td>').text(key) )
                                             .append( $('<td></td>').text(this.particle[key]) ) );
          }
        } else {
          setTimeout(this.init, 50);
          console.log('...');
        }
      }
    }

    document.editor = new Editor();

    $(document).ready(function() { 
      document.editor.init(); 
    });

});