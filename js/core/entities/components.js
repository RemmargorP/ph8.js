define(['three', 'jquery', 'core/entities/field', 'core/maths'], function(THREE, $, Field, maths) {

  /** PHYSICS */

  function setMass(particle, mass) {
    particle.mass = mass;
  }

  function setCharge(particle, charge) {
    particle.charge = charge;
  }

  function setPosition(particle, pos) {
    particle.position = pos;
  }

  function setVelocity(particle, v) {
    particle.velocity = v;
  }

  function makeGravityField(particle) {
    const G = 6.674083131313131e-11;

    var f = Field(particle);

    f.impactOn = function(current, nextstate, deltaT) {
      // m_cur * vec(a) = G (m_cur * m_this / R^3) * vec(R_(cur->this))
      // deltaV = vec(a) * deltaT
      var deltaA = sub(current.position, particle.position) 
                    .mul(G * particle.mass / sub(current.position, particle.position).len()**3 * deltaT);

      nextstate.velocity = nextstate.velocity.add(deltaA);
    }

    return f;
  }

  /** RENDER */

  function setWebController(particle) {
    particle.webcontroller = $('<span class="glyphicon glyphicon-cog"></span>');
    particle.webcontroller.click(function() {
      var winoptions = window.open('particle_options.html', 'options_' + particle.id, 'location=0,menubar=0,toolbar=0,height=700,width=800,status=0');
      
      winoptions.particle = particle;
    });
  }

  function setDOMElement(particle) {
    var ishidden = false;

    if (particle.dom == undefined) {
      particle.dom = $('<tr></tr>');
      particle.dom.click(function() {
        $(this).find('.table').toggleClass('hidden');
      });
    } else {
      if (particle.webcontroller != undefined) particle.webcontroller.detach();
      console.log(particle.dom.find('table'));
      ishidden = particle.dom.find('table').hasClass('hidden');
      particle.dom.empty(); 
    }

    var domname = $('<span></span>').text(particle.name),
        domwebcontroller = particle.webcontroller || $('');

    particle.dom.append($('<td></td>').append(domwebcontroller).append(domname));

    var tmp = $('<tbody></tbody>');

    for (key in particle) {
      if (key == 'dom' || key == 'renderObject' || key == 'name' || key == 'webcontroller') continue;

      var domfield, domvalue;

      domfield = $('<td></td>').text(key);
      domvalue = $('<td></td>').text(particle[key]);

      tmp.append( $('<tr></tr>').append(domfield).append(domvalue) );
    }

    particle.dom.append( $('<td></td>').append( $('<table class="table table-bordered' + (ishidden? ' hidden' : '') + '"></table>').append(tmp) ));

    setTimeout(function() {
      setDOMElement(particle);
    }, 2500); // update every 2.5s

    return particle.dom;
  }

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