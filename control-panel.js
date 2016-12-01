requirejs(['core/core-loader'], function() {

  requirejs(['jquery', 'core'], function($, core) {
    console.log(core);
    console.log(core.memes(3));

    console.log($('kek'));
  })  

});

