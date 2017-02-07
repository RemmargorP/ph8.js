define(
  ['jquery', 'core/core', 'core/utils', 
   'core/maths', 'core/entities/particle', 
   'core/entities/components'], 
  function($, core, utils, maths, Particle, Components) {
    function ControlPanel() {
      this.generateId = utils.generateId;
      this.core = new core.Core();

      this.addEntity = function() {
        var p = new Particle(this.generateId());

        Components.setWebController(p);
        Components.setMass(p, Math.PI);
        Components.setDOMElement(p);

        $('#particles').append(p.dom);

        this.core.addParticle(p);
      }
      this.addPlot2D = function() {}
      this.addPlot3D = function() {}

      this.openVisualizer = function() {}

      this.init = function() {}
    }

    document.cpanel = new ControlPanel();

    $(document).ready(function() { 
      document.cpanel.init(); 
    });

});