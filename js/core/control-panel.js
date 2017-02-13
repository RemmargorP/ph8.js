define(
  ['jquery', 'three', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle'], 
  function($, THREE, Core, Utils, Geometry, Particle) {
    function ControlPanel() {
      var that = this;

      this.generateId = Utils.generateId;
      this.core = new Core.Core();
      this.scene = new THREE.Scene();

      this.scene.add(new THREE.AxisHelper(30000));

      this.addEntity = function() {
        var p = new Particle(this.generateId(), Math.random(), Math.random(), new Geometry.Vector3(Math.random()*100, Math.random()*100, Math.random()*100));

        $('#particles').append(p.DOMs.listRow);

        this.core.addParticle(p);
        this.scene.add(p.renderObject);
      }
      this.addPlot2D = function() {}
      this.addPlot3D = function() {}

      this.openVisualizer = function() {
        var winVisualizer = window.open('visualizer.html', 'visualizer', 'location=0,menubar=0,toolbar=0,status=0,fullscreen=yes')
        winVisualizer.scene = that.scene;
      }

      this.init = function() {}
    }

    document.cpanel = new ControlPanel();

    $(document).ready(function() { 
      document.cpanel.init(); 
    });

});