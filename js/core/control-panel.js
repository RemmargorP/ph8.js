define(
  ['jquery', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle'], 
  function($, core, utils, Geometry, Particle) {
    function ControlPanel() {
      this.generateId = utils.generateId;
      this.core = new core.Core();

      this.addEntity = function() {
        var p = new Particle(this.generateId());

        $('#particles').append(p.DOMs.listRow);

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