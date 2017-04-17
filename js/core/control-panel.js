define(
  ['jquery', 'three', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle', 'core/entities/field'], 
  function($, THREE, Core, Utils, Geometry, Particle, Fields) {
    function ControlPanel() {
      var that = this;

      this.generateId = Utils.generateId;
      this.scene = new THREE.Scene();

      this.scene.add(new THREE.AxisHelper(500000));

      this.core = new Core.Core();

      this.runSimulation = async function() {
        this.core.simulate();
      }
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
      };

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
        /*var p = new Particle({
          name: this.generateId(),
          mass: 10000000000 * Math.random(),
          charge: 1e-8 * Math.random(),
          position: new Geometry.Vector3(Math.random() * 100, Math.random() * 100, Math.random() * 100),
          velocity: new Geometry.Vector3()
        }); 

        $('#particles').append(p.DOMs.listRow);

        var gravity = new Fields.GravityField(p);
        var repulsion = new Fields.RepulsionField(p);
        var electromagnetic = new Fields.ElectroMagneticField(p);

        this.core.addParticle(p);
        this.core.addField('GravityField', p.id);
        this.core.addField('RepulsionField', p.id);
        //this.core.addField(electromagnetic);
        that.scene.add(p.representation.renderGroup);
        */
        {
          var Earth = new Particle({
            name: 'Earth',
            mass: 6e24,
            charge: 0,
            position: new Geometry.Vector3(0, 0, 0),
            velocity: new Geometry.Vector3(0, 0, 0),
          });

          this.core.addParticle(Earth);
          this.core.addField('GravityField', Earth.id);
          this.core.addField('RepulsionField', Earth.id);

          $('#particles').append(Earth.DOMs.listRow);
          that.scene.add(Earth.representation.renderGroup);
        }

        {
          var human = new Particle({
            name: 'Human',
            mass: 70,
            charge: 0,
            position: new Geometry.Vector3(200, 0, 0),
            velocity: new Geometry.Vector3(0, 0, 0),
          });

          $('#particles').append(human.DOMs.listRow);

          this.core.addParticle(human);
          that.scene.add(human.representation.renderGroup);
        }

      };
      this.addPlot2D = function() {};
      this.addPlot3D = function() {};

      this.openVisualizer = function() {
        var winVisualizer = window.open('visualizer.html', 'visualizer', 'location=0,menubar=0,toolbar=0,status=0,fullscreen=yes');
        winVisualizer.scene = that.scene;
      };

      this.init = function() {
      };

      this.save = function() {
        console.log(this.core.serialize());
      }
    }

    document.cpanel = new ControlPanel();

    $(document).ready(function() { 
      document.cpanel.init(); 
    });

});