define(['three', 'loaders/MTLLoader', 'loaders/OBJLoader', 'core/utils'], function(THREE, MTLLoader, OBJLoader, Utils) {
  function Representation3D() {
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

    /*/////////////////////
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'scenes/models/cat/' );
    mtlLoader.load( 'cat.mtl', function( materials ) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.setPath( 'scenes/models/cat/' );
      objLoader.load( 'cat.obj', function ( renderGroup ) {
        renderGroup.__dirtyPosition = true;
        renderGroup.__dirtyRotation = true;
        renderGroup.matrixAutoUpdate = false;
        renderGroup.position.set(that.position.x, that.position.y, that.position.z);
        renderGroup.updateMatrix();
        that.renderrenderGroup = renderGroup;
      });
    });

    (async function() {
      while (!that.renderrenderGroup) {
        await (new Promise(resolve => setTimeout(resolve, 30)));
      };
    })();
    /////////////////////
    */


    this.unserialize = function(dump) {
      this.dump = [];
      this.renderGroup = new THREE.Group();

      for (var key in dump) {
        var prop = dump[key], opts;
        console.log(prop);
        if ('addBasicMesh' in prop) {
          opts = prop['addBasicMesh'];
          this.addBasicMesh(opts.radius, opts.color);
        }
        if ('addLabel' in prop) {
          opts = prop['addLabel'];
          this.addLabel(opts.text, opts.offset, opt.options);
        }
      }
    };

    this.serialize = function() {
      return this.dump;
    };
  }

  return Representation3D;
});