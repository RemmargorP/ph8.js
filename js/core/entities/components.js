define(['three', 'jquery', 'core/entities/field', 'core/maths'], function(THREE, $, Field, maths) {

  /** PHYSICS */

  function addMass(particle, mass) {
    particle.mass = mass;
  }

  function addCharge(particle, charge) {
    particle.charge = charge;
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

  function addWebController(particle) {
    particle.webcontroller = $('<span class="glyphicon glyphicon-cog"></span>');
    particle.webcontroller.click(function() {
      var winoptions = window.open('about:blank', '_blank', 'location=0,menubar=0,toolbar=0,height=700,width=800,status=0');
      
      winoptions.document.write('This is ' + particle.name);
    });
  }

  function addDOMElement(particle) {
    var nameprinted = false;
    
    particle.dom = [];

    for (key in particle) {
      if (key == 'dom' || key == 'renderObject' || key == 'name' || key == 'webcontroller') continue;
      

      var domname, domfield, domvalue;

      if (nameprinted) {
        domname = $('<td></td>');
      } else {
        domname = $('<td></td>').append($('<span></span>').text(particle.name));
        if ('webcontroller' in particle) domname.append(particle.webcontroller);
      }

      domfield = $('<td></td>').text(key);
      domvalue = $('<td></td>').text(particle[key]);


      particle.dom.push( $('<tr></tr>').append(domname).append(domfield).append(domvalue) );
      nameprinted = true;
    }

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
    addWebController: addWebController,
    addDOMElement: addDOMElement,
    addRender: addRender,
  };
})