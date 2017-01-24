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
        Components.addWebController(p);
        Components.addMass(p, 1337);
        Components.addDOMElement(p);
        $('#particles').append(p.dom);
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