define(['core/entities/particle'], function(Particle) {
  function Field() {
    this.id = '';
  }
  Field.prototype.impactOn = function(particle, options) {}
  Field.prototype.__id = 'Field';

  function GravityField(source) {
    this.source = source;
    // if (!(source instanceof Particle)) throw Error(JSON.stringify(source) + ' is not a Particle'); // safety ??
    this.id = source.id + '_gravity';
  }
  GravityField.prototype.G = 66740831313131e-11;
  GravityField.prototype.G = 66740831313131e-9;
  GravityField.prototype.impactOn = function(particle, options) {
    if (options != undefined) {
      if (options.id == particle.id) return new Vector3(0, 0, 0);
      var v = options.position.sub(particle.position);
      return v.mul(this.G * options.mass * particle.mass / v.len()**3 );  
    }

    if (this.source.id == particle.id) return new Vector3(0, 0, 0);
    var v = this.source.position.sub(particle.position);
    return v.mul(this.G * this.source.mass * particle.mass / v.len()**3 );
  }
  GravityField.prototype.__id = 'GravityField';
  GravityField.prototype.pack = function() {
    return [this.__id, this.source.pack()];
  }

  return {
    Field: Field,
    GravityField: GravityField
  }
})