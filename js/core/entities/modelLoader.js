define(['jquery', 'three', 'loaders/MTLLoader', 'loaders/OBJLoader', 'loaders/AssimpJSONLoader'], 
  function($, THREE, MTLLoader, OBJLoader, AssimpJSONLoader) {
    var models = {};

    $.ajax({
      type : 'GET',
      url : 'scenes/models/models.json',
      dataType : "text",
      success : function(data) {
        models = JSON.parse(data);
        console.log(models);
      }
    });

    function OBJMTLLoader(config, next) {
      var mtlLoader = new THREE.MTLLoader();
      mtlLoader.load( config.path + '.mtl', function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( config.path + '.obj', function(object) {
          object.scale.multiplyScalar(config.cast_radius);
          next(object);
        }, function(p) { console.log("PROG", p); }, function(e) { console.log("ERROR", e); } );
      });
    };

    function OBJLoader(config, next) {
      var objLoader = new THREE.OBJLoader();
      objLoader.load( config.path + '.obj', function(object) {
        object.scale.multiplyScalar(config.cast_radius);
        next(object);
      } );
    };

    function getObject(name, next) {
      if (!(name in models)) {
        return undefined;
      }
      var loaders = {
        'obj_mtl': OBJMTLLoader,
        'obj': OBJLoader,
      };
      loaders[models[name].type](models[name], next);
    }

    return {
      getObject: getObject,
    }
  }
)