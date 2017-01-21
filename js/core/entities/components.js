define(['three', 'jquery', 'core/entities/field', 'core/maths'], function(THREE, $, Field, maths) {

  /** PHYSICS */

  function addMass(particle, mass) {
    particle.mass = mass;
  }

  function addCharge(particle, q) {
    particle.q = q;
  }

  function addPosition(particle, pos) {
    particle.position = pos;
  }

  function addVelocity(particle, v) {
    particle.velocity = v;
  }

  function makeGravityField(particle) {
    const G = 6.674083131313131e-11;

    var f = Field(particle);

    f.impactOn = function(current, nextstate, deltaT) {
      var deltaA = sub(current.position, particle.position) //
                    .mul(G * particle.mass * current.mass / sub(current.position, particle.position).len()**3 * deltaT);
      nextstate.velocity = nextstate.velocity.add(deltaA);
    }

    return f;
  }

  /** RENDER */

  function addDOMElement(particle) {
    var nameprinted = false;
    
    particle.dom = $('<table></table>');
    console.log(particle.dom.outerHTML);

    for (key in particle) {
      if (key == 'dom' || key == 'renderObject' || key == 'name') continue;
      
      if (!nameprinted)
        particle.dom.append('<tr><td>'+particle.name+'</td><td>' + key + '</td><td>' + particle[key] + '</td></tr>');
      else
        particle.dom.append('<tr><td></td><td>' + key + '</td><td>' + particle[key] + '</td></tr>');
      nameprinted = true;
      console.log(particle.dom.html());
    }

    particle.dom = $(particle.dom.html());

    return particle.dom;
  }

  function addRender(particle, color, radius) {
    var geometry = new THREE.SphereGeometry( radius, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: color} );
    var sphere = new THREE.Mesh( geometry, material );

    particle.renderObject = sphere;
  
    return sphere;
  }



  return {
    addMass: addMass,
    addCharge: addCharge,
    addPosition: addPosition,
    addVelocity: addVelocity,
    makeGravityField: makeGravityField,
    addDOMElement: addDOMElement,
    addRender: addRender,
  };
})