define(
  ['jquery', 'three', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle', 'core/entities/field'], 
  function($, THREE, Core, Utils, Geometry, Particle, Fields) {
    function ControlPanel() {
      var that = this;

      this.generateId = Utils.generateId;
      this.scene = new THREE.Scene();

      this.scene.add(new THREE.AxisHelper(30000));

      this.core = new Core.Core();

      this.runSimulation = async function() {
        this.core.simulate();
      };
      this.runSimulation();

      this.toggleSimulation = function() {
        if (!this.core.running) {
          this.core.continue();
        } else {
          this.core.stop();
        }
        if (this.core.running) {
          $("#core_state").removeClass().addClass('glyphicon glyphicon-pause');
        } else {
          $("#core_state").removeClass().addClass('glyphicon glyphicon-play');
        }
      }

      this.setSimulationEndingTime = function() {
        console.log('set time');
        var field = $('#timer');
        if (!Utils.isFloat(field.val())) {
            alert("Value must be a float number!");
            return;
        }
        this.core.setSimulationEndingTime(parseFloat(field.val()));
        console.log(this.core.simulateTil);
        console.log(this.core.time);
      };

      this.addEntity = function() {
        var p = new Particle(this.generateId(), 9+Math.random(), Math.random(), new Geometry.Vector3(Math.random()*100, Math.random()*100, Math.random()*100));

        $('#particles').append(p.DOMs.listRow);

        var gravity = new Fields.GravityField(p);

        this.core.addParticle(p);
        this.core.addField(gravity);
        this.scene.add(p.renderObject);
      }
      this.addPlot2D = function() {}
      this.addPlot3D = function() {}

      this.openVisualizer = function() {
        var winVisualizer = window.open('visualizer.html', 'visualizer', 'location=0,menubar=0,toolbar=0,status=0,fullscreen=yes')
        winVisualizer.scene = that.scene;
      }

      this.init = function() {
      };
    }

    document.cpanel = new ControlPanel();

    $(document).ready(function() { 
      document.cpanel.init(); 
    });

});