define(
  ['jquery', 'core/core', 'core/utils', 
   'core/maths', 'core/entities/particle', 
   'core/entities/components'], 
  function($, core, utils, maths, Particle, Components) {
    function ControlPanel() {
      this.generateId = utils.generateId;

      this.addEntity = function() {
        // particle
        var p = new Particle(this.generateId());
        Components.addMass(p, 0.1);
        Components.addPosition(p, new maths.Vector3(0, 0, 0));
        Components.addVelocity(p, new maths.Vector3(0.2, 0, 0));
        $('#particles').append($('<tr></tr>').append( $('<td></td>').text(p.name) ).append( $('<td></td>').append(Components.addDOMElement(p)) ) );

        this.core.addParticle(p);
      }
      this.addPlot2D = function() {}
      this.addPlot3D = function() {}

      this.openVisualizer = function() {}

      this.init = function() {
        this.core = new core.Core();
      }
    }

    document.cpanel = new ControlPanel();

    $(document).ready(function() { 
      document.cpanel.init(); 
    });

});