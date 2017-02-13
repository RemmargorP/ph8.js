define(
  ['jquery', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle'], 
  function($, Core, Utils, Geometry, Particle) {
    function Editor() {
      var that = this;

      this.update = function() {
        console.log(that.particle);
        console.log(that.particle.renderObject.position);
        that.particle.renderObject.position.set(that.position.x, that.position.y, that.position.z);
      }

      this.makeTextProperty = function(key) {
        var field = $('<input type="text">'), fieldSetter = $('<input type="button" value="Set">');
        field.val(that.particle[key]);
        fieldSetter.click(function(event) {
          //console.log('wut')
          that.particle[key] = field.val();
          that.update();
        });
        return $('<span></span>').append(field).append(fieldSetter);
      }

      this.makeFloatProperty = function(key) {
        var field = $('<input type="text">'), fieldSetter = $('<input type="button" value="Set">');
        field.val(that.particle[key]);
        fieldSetter.click(function(event) {
          if (!Utils.isFloat(field.val())) {
            alert("Value must be a float number!");
            return;
          }
          //console.log('wut2')
          that.particle[key] = parseFloat(field.val());
          that.update();
        });
        return $('<span></span>').append(field).append(fieldSetter);
      }

      this.makeVector3ComponentProperty = function(key, comp) {
        var field = $('<input type="text">'), fieldSetter = $('<input type="button" value="Set">');
        field.val(that.particle[key][comp]);
        fieldSetter.click(function(event) {
          if (!Utils.isFloat(field.val())) {
            alert("Value must be a float number!");
            return;
          }
          that.particle[key][comp] = parseFloat(field.val());
          that.update();
        });
        return $('<div>'+comp+'</div>').append(field).append(fieldSetter);
      }

      this.makeVector3Property = function(key) {
        var x = that.makeVector3ComponentProperty(key, 'x'),
            y = that.makeVector3ComponentProperty(key, 'y'),
            z = that.makeVector3ComponentProperty(key, 'z');
        return $('<span></span>').append(x).append(y).append(z);
      }

      this.init = function() {
        if (particle != undefined) {
          this.particle = particle;

          $('h1').remove();
          $('div.hidden').toggleClass('hidden');
          $('p').text(this.particle['name']);

          // name mass charge position velocity

          var $props = $('tbody');

          $props.append( $('<tr></tr>').append( $('<td></td>').text('Name') ).append( $('<td></td>').append(that.makeTextProperty('name') ) ) )
          $props.append( $('<tr></tr>').append( $('<td></td>').text('Mass') ).append( $('<td></td>').append(that.makeFloatProperty('mass') ) ) )
          $props.append( $('<tr></tr>').append( $('<td></td>').text('Charge') ).append( $('<td></td>').append(that.makeFloatProperty('charge') ) ) )
          $props.append( $('<tr></tr>').append( $('<td></td>').text('Position') ).append( $('<td></td>').append(that.makeVector3Property('position') ) ) )
          $props.append( $('<tr></tr>').append( $('<td></td>').text('Velocity') ).append( $('<td></td>').append(that.makeVector3Property('velocity') ) ) )

        } else {
          setTimeout(this.init, 50);
        }
      }
    }

    document.editor = new Editor();

    $(document).ready(function() { 
      document.editor.init(); 
    });

});