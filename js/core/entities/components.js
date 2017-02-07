define(['three', 'jquery', 'core/entities/field', 'core/maths'], function(THREE, $, Field, maths) {

  function setRender(particle, color, radius) {
    var geometry = new THREE.SphereGeometry( radius, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: color} );
    var sphere = new THREE.Mesh( geometry, material );

    particle.renderObject = sphere;
  
    return sphere;
  }



  return {
    setMass: setMass,
    setCharge: setCharge,
    setPosition: setPosition,
    setVelocity: setVelocity,
    makeGravityField: makeGravityField,
    setWebController: setWebController,
    setDOMElement: setDOMElement,
    setRender: setRender,
  };
})