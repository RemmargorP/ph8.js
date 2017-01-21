define(['jquery', 'core/utils', 'core/maths'], function($, utils, maths) {
  function ControlPanel() {
    this.generateId = utils.generateId;
  }

  var cpanel = new ControlPanel();

  for (var id = 0; id < 10; id++) {
    $('body').append('<div>' + cpanel.generateId() + '</div>');
  }

  var v = new maths.Vector3(1, 2);

  console.log(v);

});