define(['core/entities/particle', 'core/geometry'], function(Particle, Geometry) {
  function Field() {
    this.id = '';
  }
  Field.prototype.impactOn = function(particle) {};
  Field.prototype.__id = 'Field';

  // гравитационное притяжение
  function GravityField(source) {
    this.source = source;
    this.id = source.id + '_gravity';
  }
  GravityField.prototype.G = 6.6740831313131e-11;
  GravityField.prototype.impactOn = function(particle) {
    if (this.source.id == particle.id) return new Geometry.Vector3(0, 0, 0);
    var v = this.source.position.sub(particle.position);
    return v.mul(this.G * this.source.mass * particle.mass / Math.pow(v.len(), 3) );
  };
  GravityField.prototype.__id = 'GravityField';

  // отталкивание 
  function RepulsionField(source) {
    this.source = source;
    this.id = source.id + '_repulsion';
  }
  RepulsionField.prototype.impactOn = function(particle) {
    if (this.source.id == particle.id) return new Geometry.Vector3(0, 0, 0);
    var v = particle.position.sub(this.source.position); // TODO 
    return v.mul(this.alpha / Math.pow(Math.max(1e-12, v.len() - this.source.radius - particle.radius), 6)); // v * (1 / v^6) => v^-5 // TODO: подгон (?)
  };
  RepulsionField.prototype.alpha = 1e5;
  RepulsionField.prototype.__id = 'RepulsionField';

  // электромагнитное притяжение / отталкивание
  function ElectroMagneticField(source) {
    this.source = source;
    this.id = source.id + '_electromagnetic';
  }
  ElectroMagneticField.prototype.k = 8.9e9; // TODO: более точное значение
  ElectroMagneticField.prototype.impactOn = function(particle) {
    if (this.source.id == particle.id) return new Geometry.Vector3(0, 0, 0);
    var v = this.source.position.sub(particle.position);
    return v.mul(this.k * this.source.charge * particle.charge / Math.pow(v.len(), 3) );
  };
  ElectroMagneticField.prototype.__id = 'ElectroMagneticField';

  return {
    Field: Field,
    GravityField: GravityField,
    RepulsionField: RepulsionField,
    ElectroMagneticField: ElectroMagneticField
  }
});