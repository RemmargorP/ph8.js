define(
  ['jquery', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle'], 
  function($, Core, Utils, Geometry, Particle) {
    function ControlPanel() {
      this.generateId = Utils.generateId;
      this.Core = new Core.Core();

      this.addEntity = function() {
        var p = new Particle(this.generateId());

        $('#particles').append(p.DOMs.listRow);

        this.Core.addParticle(p);
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