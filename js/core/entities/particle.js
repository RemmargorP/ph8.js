define(['jquery', 'core/geometry', 'uuid', 'core/utils', 'core/entities/representation3D'],
        function($, Geometry, UUID, Utils, Representation3D) {

  /*
  * config:
  *   - uuid
  *   - name
  *   - mass
  *   - charge
  *   - position (Vector3)
  *   - velocity (Vector3)
  *   - history:
  *       - maxSize (default: 500)
  *       - precision (default: 10)
  *
  * supposed that name and id doesn't change while simulating
  */

  function Particle(config) {
    config = config || {};

    var that = this;

    this.id = config.uuid || UUID();
    this.name = config.name || '';
    this.mass = config.mass || 0;
    this.charge = config.charge || 0;
    this.position = config.position || new Geometry.Vector3(0, 0, 0);
    this.velocity = config.velocity || new Geometry.Vector3(0, 0, 0);

    this.historyOptions = config.history || {};
    this.historyOptions.maxSize = this.historyOptions.maxSize || 500;
    this.historyOptions.precision = this.historyOptions.precision || 1e1; // if any of properties changed more than (precision) then save current state

    this.history = [];

    this.serialize = function(verbose) {
      verbose = verbose || 0;

      var data = {
        id: this.id,
        name: this.name,
        mass: this.mass,
        charge: this.charge,
        position: this.position.serialize(),
        velocity: this.velocity.serialize()
      };

      if (verbose >= 1) {
        data.history = this.history;
        data.representation = this.representation.serialize();
      }
      return data;
    };

    this.deserialize = function(p) {
      p = p || {};
      if (p.hasOwnProperty('id')) this.id = p.id;
      if (p.hasOwnProperty('name')) this.name = p.name;
      if (p.hasOwnProperty('mass')) this.mass = p.mass;
      if (p.hasOwnProperty('charge')) this.charge = p.charge;
      if (p.hasOwnProperty('position')) this.position = (new Geometry.Vector3()).deserialize(p.position);
      if (p.hasOwnProperty('velocity')) this.velocity = (new Geometry.Vector3()).deserialize(p.velocity);
      if (p.hasOwnProperty('history')) this.history = p.history;
      if (p.hasOwnProperty('representation')) {
        this.representation = new Representation3D();
        this.representation.deserialize(p.representation);
      }
    };

    this.makeHistoryStamp = function(timestamp) {
      return {
        time: timestamp,
        mass: that.mass,
        charge: that.charge,
        position: that.position.serialize(),
        velocity: that.velocity.serialize(),
      }
    };
    this.history[0] = this.makeHistoryStamp(0);

    this.updateHistory = function(timestamp) {
      if (that.history.length == 0) {
        that.history[0] = that.makeHistoryStamp(timestamp);
        return;
      }

      var cur, last = that.history[that.history.length - 1];

      timestamp = timestamp || last.time;

      cur = that.makeHistoryStamp(timestamp);

      var curp = (new Geometry.Vector3()).deserialize(cur.position),
          curv = (new Geometry.Vector3()).deserialize(cur.velocity);

      var update = false;
      update |= Math.abs(cur.mass - last.mass) > that.historyOptions.precision;
      update |= curp.sub(last.position).len() > that.historyOptions.precision;
      update |= curv.sub(last.velocity).len() > that.historyOptions.precision;

      if (update) {
        that.history.push(cur);
        if (that.history.length > that.historyOptions.maxSize)
          that.history = that.history.slice(that.history.length - that.historyOptions.maxSize);
      }
    };

    var r = 1;
    var col = Utils.getRandomColor(0.6);

    this.representation = new Representation3D();
    this.representation.addBasicMesh(r, col);
    this.representation.addLabel(this.name); 

    this.update = function() {
      this.representation.update(this.position);
    }
    this.update();

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
    });

    this.DOMs.listRow = $('<tr></tr>');

    this.DOMs.listRow.click(function() {
      $(this).find('td table').toggleClass('hidden');
    });
    
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
});