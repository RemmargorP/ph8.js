define(['jquery', 'three', 'core/geometry', 'uuid', 'core/utils'], function($, THREE, Geometry, UUID, Utils) {

  function Particle(name, mass, charge, pos, vel, radius, color, historyOptions) {
    var that = this;

    this.id = UUID();
    this.name = name || '';
    this.mass = mass || 0;
    this.charge = charge || 0;
    this.position = pos || new Geometry.Vector3(0, 0, 0);
    this.velocity = vel || new Geometry.Vector3(0, 0, 0);

    this.currentForce = new Geometry.Vector3(0, 0, 0); // for current step of simulation

    this.historyOptions = historyOptions || {};
    this.historyOptions.maxSize = this.historyOptions.maxSize || 10000;
    this.historyOptions.precision = this.historyOptions.precision || 1e-1; // if any of properties changed more than (precision) than save current state

    this.history = [];

    this.makeHistoryStamp = function(timestamp) {
      return {
        time: timestamp,
        name: that.name,
        mass: that.mass,
        charge: that.charge,
        position: that.position,
        velocity: that.velocity,
      }
    }
    this.history[0] = this.makeHistoryStamp(-1);

    this.updateHistory = function(timestamp) {
      if (that.history.length == 0) {
        that.history[0] = that.makeHistoryStamp(timestamp);
        return;
      }

      var cur, last = that.history[that.history.length - 1];

      timestamp = timestamp || last.time;

      cur = that.makeHistoryStamp(timestamp);

      var update = false;
      update |= cur.name != last.name;
      update |= Math.abs(cur.mass - last.mass) > that.historyOptions.precision;
      update |= cur.position.sub(last.position).len() > that.historyOptions.precision;
      // update |= cur.velocity.sub(last.velocity).len() > that.historyOptions.precision; // not necessary

      if (update) {
        that.history[that.history.length] = cur;
        if (that.history.length > that.historyOptions.maxSize)
          that.history = that.history.slice(that.history.length - that.historyOptions.maxSize);
      }
    }

    var r = radius || Math.cbrt(mass) * 3;
    var col = color || Utils.getRandomColor(0.6);
    var geometry = new THREE.SphereGeometry( r, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: col} );
    var sphere = new THREE.Mesh( geometry, material );
    var label = Utils.makeTextSprite(name, {borderThickness: 1, fontsize:32});
    label.name = 'label';
    label.position.x = r+1;
    label.position.y = r+1;
    sphere.setLinearVelocity(0.1, 0, 0);
    sphere.__dirtyPosition = true;
    sphere.__dirtyRotation = true;
    sphere.matrixAutoUpdate = false;
    sphere.position.set(this.position.x, this.position.y, this.position.z);
    sphere.updateMatrix();
    sphere.add(label);
    

    this.renderObject = sphere;

    // Web controls
    this.DOMs = {};
    this.DOMs.webcontroller = $('<span class="glyphicon glyphicon-cog"></span>');
    this.DOMs.webcontroller.click(function() {
      var winoptions = window.open('particle_options.html', 'options_' + that.id, 'location=0,menubar=0,toolbar=0,height=700,width=800,status=0');
      winoptions.particle = that;
      winoptions.onbeforeunload = function() {
        that.DOMs.refreshListRow.click();
      }
    });

    this.DOMs.refreshListRow = $('<span class="glyphicon glyphicon-refresh"></span>');
    this.DOMs.refreshListRow.click(function() {
      that.DOMs.listRow.find('#name').text(that.name);
      that.DOMs.listRow.find('#mass').text(that.mass);
      that.DOMs.listRow.find('#charge').text(that.charge);
      that.DOMs.listRow.find('#position').text(that.position);
      that.DOMs.listRow.find('#velocity').text(that.velocity);
    })

    this.DOMs.listRow = $('<tr></tr>');

    this.DOMs.listRow.click(function() {
      $(this).find('td table').toggleClass('hidden');
    })
    
    var domname = $('<td></td>');
    domname.append(this.DOMs.refreshListRow);
    domname.append(this.DOMs.webcontroller);
    domname.append($('<span id="name"></span>').text(this.name));
    this.DOMs.listRow.append( domname );

    var props = $('<tbody></tbody>');
    var keys = ['position', 'velocity', 'mass', 'charge'];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      props.append( $('<tr></tr>').append( $('<td></td>').text(key) ).append( $('<td id="'+key+'"></td>').text(this[key]) ));
    }



    this.DOMs.listRow.append( $('<td></td>').append( $('<table class="table table-bordered"></table>').append(props) ));

  }

  return Particle;
})