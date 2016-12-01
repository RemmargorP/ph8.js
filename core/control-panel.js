requirejs(['core-loader'], function() {
  console.log('Loaded initital config...')

  requirejs(['jquery', 'core'], function($, core) {
    $("body").append("<p>LOOL</p>");
  })  

});

