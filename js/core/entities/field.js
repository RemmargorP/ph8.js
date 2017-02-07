define(['core/entities/particle'], function(Particle) {
  function Field() {
    this.impactOn = function(particle) {}
  }

  function GravityField(source) {
    // if (!(source instanceof Particle)) throw Error(JSON.stringify(source) + ' is not a Particle'); // safety ??
    this.impactOn = function(particle) {
      if (source.id == particle.id) return;
      var v = source.position.sub(particle.position);
      particle.currentForce.add( v.mul(this.G * source.mass * particle.mass / v.len()**3 ) );
    }
  }
  GravityField.prototype.G = 66740831313131e-11;

  return {
    Field: Field,
    GravityField: GravityField
  }
})