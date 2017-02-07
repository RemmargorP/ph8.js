define(['jquery', 'core/geometry', 'uuid'], function($, Geometry, UUID) {

  function Particle(name, mass, charge, pos, vel) {
    var that = this;

    this.id = UUID();
    this.name = name || '';
    this.mass = mass || 0;
    this.charge = charge || 0;
    this.position = pos || new Geometry.Vector3(0, 0, 0);
    this.velocity = vel || new Geometry.Vector3(0, 0, 0);

    this.currentForce = new Geometry.Vector3(0, 0, 0); // for current iteration of simulation

    this.history = []; // TODO




    // Web controls
    this.DOMs = {};
    this.DOMs.webcontroller = $('<span class="glyphicon glyphicon-cog"></span>');
    this.DOMs.webcontroller.click(function() {
      var winoptions = window.open('particle_options.html', 'options_' + that.id, 'location=0,menubar=0,toolbar=0,height=700,width=800,status=0');
      winoptions.particle = that;
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
    
    var domname = $('<td></td>');
    domname.append(this.DOMs.refreshListRow);
    domname.append(this.DOMs.webcontroller);
    domname.append($('<span id="name"></span>').text(this.name));
    this.DOMs.listRow.append( domname );

    var props = $('<tbody></tbody>');
    var keys = ['position', 'velocity', 'mass', 'charge'];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      props.append( $('<tr></tr>').append( $('<td></td>').text(key) ).append( $('<td></td>').text(this[key]).attr('id', key) ) );
    }

    this.DOMs.listRow.append( $('<td></td>').append( $('<table class="table table-bordered"></table>').append(props) ));

  }

  return Particle;
})