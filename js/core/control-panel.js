define(['jquery', 'core/utils'], function($, utils) {
  function ControlPanel() {
    this.generateId = utils.generateId;
  }

  var cpanel = new ControlPanel();
  
  for (var id = 0; id < 10; id++) {
    $('body').append('<div>' + cpanel.generateId() + '</div>');
  }
});