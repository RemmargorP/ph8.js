define(
  ['jquery', 'three', 'core/core', 'core/utils', 
   'core/geometry', 'core/entities/particle'], 
  function($, THREE, Core, Utils, Geometry, Particle) {
    function Editor() {
      var that = this;
 
      this.makeTextProperty = function(key) {
        var field = $('<input type="text">'), fieldSetter = $('<input type="button" class="btn btn-default" value="Set">');
        field.val(that.particle[key]);
        fieldSetter.click(function(event) {
          that.particle[key] = field.val();
          if (key == 'name') { // TODO: refactor
            that.particle.renderObject.remove(that.particle.renderObject.getObjectByName('label'));

            var label = Utils.makeTextSprite(that.particle.name, {borderThickness: 1, fontsize:32});
            label.name = 'label';
            var tmpbbox = new THREE.Box3().setFromObject(that.particle.renderObject);
            label.position.x = tmpbbox.getSize().x + 1;
            label.position.y = tmpbbox.getSize().y + 1;
            
            that.particle.renderObject.add(label);
          }
          that.particle.update();
        });
        return $('<span></span>').append(field).append(fieldSetter);
      };

      this.makeFloatProperty = function(key) {
        var field = $('<input type="text">'), fieldSetter = $('<input class="btn btn-default" type="button" value="Set">');
        field.val(that.particle[key]);
        fieldSetter.click(function(event) {
          if (!Utils.isFloat(field.val())) {
            alert("Value must be a float number!");
            return;
          }
          that.particle[key] = parseFloat(field.val());
          that.particle.update();
        });
        return $('<span></span>').append(field).append(fieldSetter);
      };

      this.makeVector3ComponentProperty = function(key, comp) {
        var field = $('<input type="text">'), fieldSetter = $('<input class="btn btn-default" type="button" value="Set">');
        field.val(that.particle[key][comp]);
        fieldSetter.click(function(event) {
          if (!Utils.isFloat(field.val())) {
            alert("Value must be a float number!");
            return;
          }
          console.log(that.particle[key]);
          var tmp = that.particle[key].copy();
          tmp[comp] = parseFloat(field.val());
          that.particle[key] = tmp;
          that.particle.update();
        });
        return $('<div>'+comp+'</div>').append(field).append(fieldSetter);
      };

      this.makeVector3Property = function(key) {
        var x = that.makeVector3ComponentProperty(key, 'x'),
            y = that.makeVector3ComponentProperty(key, 'y'),
            z = that.makeVector3ComponentProperty(key, 'z');
        return $('<span></span>').append(x).append(y).append(z);
      };

      this.init = function() {
        if (particle != undefined) {
          this.particle = particle;

          $('h1').remove();
          $('div.hidden').toggleClass('hidden');
          $('p').text(this.particle['name']);

          // name mass charge position velocity

          var $props = $('tbody');

          $props.append( $('<tr></tr>').append( $('<td></td>').text('Name') ).append( $('<td></td>').append(that.makeTextProperty('name') ) ) );
          $props.append( $('<tr></tr>').append( $('<td></td>').text('Mass') ).append( $('<td></td>').append(that.makeFloatProperty('mass') ) ) );
          $props.append( $('<tr></tr>').append( $('<td></td>').text('Charge') ).append( $('<td></td>').append(that.makeFloatProperty('charge') ) ) );
          $props.append( $('<tr></tr>').append( $('<td></td>').text('Position') ).append( $('<td></td>').append(that.makeVector3Property('position') ) ) );
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