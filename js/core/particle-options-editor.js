define(
  ['jquery', 'core/core', 'core/utils', 
   'core/maths', 'core/entities/particle', 
   'core/entities/components'], 
  function($, core, utils, maths, Particle, Components) {
    function Editor() {
      this.init = function() {
        if (particle != undefined) {
          this.particle = particle;

          this.particle['name'] = 'Name Changed';
          this.particle['new field'] = 'New Field Created & Mass Changed (+10)';
          this.particle['mass'] += 10;

          $('h1').remove();
          $('div.hidden').toggleClass('hidden');

          for (key in this.particle) {
            $('tbody').append( $('<tr></tr>').append( $('<td></td>').text(key) )
                                             .append( $('<td></td>').text(this.particle[key]) ) );
          }
        } else {
          setTimeout(this.init, 50);
        }
      }
    }

    document.editor = new Editor();

    $(document).ready(function() { 
      document.editor.init(); 
    });

});