define(['three', 'core/utils', 'loaders/MTLLoader', 'loaders/OBJLoader', 'loaders/AssimpJSONLoader', 'core/entities/modelLoader'], 
  function(THREE, Utils, MTLLoader, OBJLoader, AssimpJSONLoader, ModelLoader) {
  
  function Representation3D() {
    var that = this;

    this.renderGroup = new THREE.Group();

    this.dump = [];

    this.update = function(position) {
      this.renderGroup.position.set(position.x, position.y, position.z);
      this.renderGroup.updateMatrix();
    };

    this.addBasicMesh = function(radius, color) {
      this.dump.push({addBasicMesh: {radius: radius, color: color}});

      var geometry = new THREE.SphereGeometry( radius, 32, 32 );
      var material = new THREE.MeshBasicMaterial( {color: color} );
      var sphere = new THREE.Mesh( geometry, material );
      sphere.__dirtyPosition = true;
      sphere.__dirtyRotation = true;
      sphere.matrixAutoUpdate = false;

      this.renderGroup.add(sphere);
    };

    this.addModel = function(name, radius) {
      this.dump.push({addModel: {name: name, radius: radius}});
      ModelLoader.getObject(name, function(object) {
        object.scale.multiplyScalar(radius);
        that.renderGroup.add(object);
      })
    };

    this.addPointLight = function(color, intensity, distance, decay) {
      color = color || '#ffffff';
      intensity = intensity || 1;
      distance = distance || 0;
      decay = decay || 1;

      this.dump.push({addPointLight: {color: color, intensity: intensity, distance: distance, decay: decay}});

      var light = new THREE.PointLight( color, intensity, distance, decay );
      this.renderGroup.add(light);
    }

    this.addLabel = function(text, offset, options) {
      this.dump.push({addLabel: {text: text, offset: offset, options: options}});

      options = options || {borderThickness: 1, fontsize:18};
      offset = offset || {x: 1, y: 1, z: 0};

      var label = Utils.makeTextSprite(text, {borderThickness: 1, fontsize:32});
      label.position.x = offset.x;
      label.position.y = offset.y;
      label.position.z = offset.z;

      this.renderGroup.add(label);
    };

    this.deserialize = function(dump) {
      this.dump = [];
      this.renderGroup = new THREE.Group();

      for (var key in dump) {
        var prop = dump[key], opts;
        if ('addBasicMesh' in prop) {
          opts = prop['addBasicMesh'];
          this.addBasicMesh(opts.radius, opts.color);
        }
        if ('addLabel' in prop) {
          opts = prop['addLabel'];
          var text = opts['text'], offset = opts['offset'], options = opts['options'];
          this.addLabel(text, offset, options);
        }
        if ('addModel' in prop) {
          opts = prop['addModel'];
          var name = opts['name'], radius = opts['radius'];
          this.addModel(name, radius);
        }
        if ('addPointLight' in prop) {
          opts = prop['addPointLight'];
          this.addPointLight(opts.color, opts.intensity, opts.distance, opts.decay);
        }
      }
    };

    this.serialize = function() {
      return this.dump;
    };
  }

  return Representation3D;
});