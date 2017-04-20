define(
  ['jquery', 'three', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle', 'core/entities/field',
   'FileSaver'], 
  function($, THREE, Core, Utils, Geometry, Particle, Fields, saveAs) {
    function ControlPanel() {
      var that = this;

      this.generateId = Utils.generateId;
      this.scene = new THREE.Scene();

      this.scene.add(new THREE.AxisHelper(1e9));
      this.scene.add( new THREE.AmbientLight( 0x292929 ) );
      //this.scene.add( new THREE.AmbientLight( 0xeeeeee ) );

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
          var Sun = new Particle({
            name: 'Sun',
            mass: 1.9885e30,
            charge: 0,
            radius: 7e8,
            position: new Geometry.Vector3(0, 0, 0),
            velocity: new Geometry.Vector3(0, 0, 0),
          });

          Sun.representation.addBasicMesh(700e8, '#F9B900');
          Sun.representation.addPointLight('#F9B900', 1, 0, 2);

          Sun.generateDOMs();

          this.core.addParticle(Sun);
          this.core.addField('GravityField', Sun.id);
          this.core.addField('RepulsionField', Sun.id);

          $('#particles').append(Sun.DOMs.listRow);
          that.scene.add(Sun.representation.renderGroup);
        }

        {
          var Earth = new Particle({
            name: 'Earth',
            mass: 6e24,
            charge: 0,
            radius: 6400000,
            position: new Geometry.Vector3(149e9, 0, 0),
            velocity: new Geometry.Vector3(0, 29.8e3, 0),
          });

          Earth.representation.addModel('earth', 5.9e8);

          Earth.generateDOMs();

          this.core.addParticle(Earth);
          this.core.addField('GravityField', Earth.id);
          this.core.addField('RepulsionField', Earth.id);

          $('#particles').append(Earth.DOMs.listRow);
          that.scene.add(Earth.representation.renderGroup);
        }

        {
          var Moon = new Particle({
            name: 'Moon',
            mass: 7.3e22,
            charge: 0,
            radius: 1738e3,
            position: new Geometry.Vector3(149e9 + 385e6, 0, 0),
            velocity: new Geometry.Vector3(0, 29.8e3 + 1.02e3, 0),
          });

          Moon.representation.addBasicMesh(1.738e8, '#4D5552');

          Moon.generateDOMs();

          this.core.addParticle(Moon);
          this.core.addField('GravityField', Moon.id);
          this.core.addField('RepulsionField', Moon.id);

          $('#particles').append(Moon.DOMs.listRow);
          that.scene.add(Moon.representation.renderGroup);
        }

      };
      this.addPlot2D = function() {};
      this.addPlot3D = function() {};

      this.openVisualizer = function() {
        var winVisualizer = window.open('visualizer.html', 'visualizer', 'location=0,menubar=0,toolbar=0,status=0,fullscreen=yes');
        winVisualizer.scene = that.scene;
      };

      this.save = function(filename) {
        var data = this.core.serialize();

        var blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
        
        saveAs(blob, filename);
      };

      this.load = function(data) {
        that.core.deserialize(data);

        for (var key in that.core.particles) {
          var p = that.core.particles[key];
          p.generateDOMs();
          $('#particles').append(p.DOMs.listRow);
          that.scene.add(p.representation.renderGroup);
        }
      };

      this.readConfigFile = function(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = e.target.result;
          that.load(JSON.parse(contents));
        };
        reader.readAsText(file);
      };

      this.init = function() {
        $('#loadfromconfigfile').on('change', this.readConfigFile);
        $('#savetoconfigfile').on('click', function() {
          var filename = prompt('Config filename:');
          if (filename) that.save(filename);
        })
      };
    }

    document.cpanel = new ControlPanel();

    $(document).ready(function() { 
      document.cpanel.init(); 
    });

});