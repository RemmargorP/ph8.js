define(['core/entities/particle', 'core/geometry'], function(Particle, Geometry) {
  function Field() {
    this.id = '';
  }
  Field.prototype.impactOn = function(particle, options) {}
  Field.prototype.__id = 'Field';


  // гравитационное притяжение
  function GravityField(source) {
    this.source = source;
    // if (!(source instanceof Particle)) throw Error(JSON.stringify(source) + ' is not a Particle'); // safety ??
    this.id = source.id + '_gravity';
  }
  GravityField.prototype.G = 66740831313131e-11;
  GravityField.prototype.impactOn = function(particle, options) {
    if (options != undefined) {
      if (options.id == particle.id) return new Vector3(0, 0, 0);
      var v = options.position.sub(particle.position);
      return v.mul(this.G * options.mass * particle.mass / v.len()**3 );  
    }

    if (this.source.id == particle.id) return new Geometry.Vector3(0, 0, 0);
    var v = this.source.position.sub(particle.position);
    return v.mul(this.G * this.source.mass * particle.mass / v.len()**3 );
  }
  GravityField.prototype.__id = 'GravityField';
  GravityField.prototype.pack = function() {
    return [this.__id, this.source.pack()];
  }


  // отталкивание 
  function RepulsionField(source) {
    this.source = source;
    this.id = source.id + '_repulsion';
  }
  RepulsionField.prototype.impactOn = function(particle, options) { // TODO : кривой перевод?
    if (options != undefined) {
      if (options.id == particle.id) return new Vector3(0, 0, 0);
      var v = particle.position.sub(options.position);
      return v.mul(this.alpha / Math.pow(v.len(), 6)); // v * (1 / v^6) => v^-5 // TODO: подгон (?)
    }
    if (this.source.id == particle.id) return new Geometry.Vector3(0, 0, 0);
      var v = particle.position.sub(this.source.position);
      return v.mul(this.alpha / Math.pow(v.len(), 6)); // v * (1 / v^6) => v^-5 // TODO: подгон (?)
  }
  RepulsionField.prototype.alpha = 1e9;
  RepulsionField.prototype.__id = 'RepulsionField';
  RepulsionField.prototype.pack = function() {
    return [this.__id, this.source.pack()];
  }


  // электромагнитное притяжение / отталкивание
  function ElectroMagneticField(source) {
    this.source = source;
    // if (!(source instanceof Particle)) throw Error(JSON.stringify(source) + ' is not a Particle'); // safety ??
    this.id = source.id + '_electromagnetic';
  }
  ElectroMagneticField.prototype.k = 8.9*10**9; // TODO: более точное значение 
  ElectroMagneticField.prototype.impactOn = function(particle, options) {
    if (options != undefined) {
      if (options.id == particle.id) return new Vector3(0, 0, 0);
      var v = options.position.sub(particle.position);
      return v.mul(this.k * options.charge * particle.charge / v.len()**3 );  
    }

    if (this.source.id == particle.id) return new Geometry.Vector3(0, 0, 0);
    var v = this.source.position.sub(particle.position);
    return v.mul(this.k * this.source.charge * particle.charge / v.len()**3 );
  }
  ElectroMagneticField.prototype.__id = 'ElectroMagneticField';
  ElectroMagneticField.prototype.pack = function() {
    return [this.__id, this.source.pack()];
  }

  return {
    Field: Field,
    GravityField: GravityField,
    RepulsionField: RepulsionField,
    ElectroMagneticField: ElectroMagneticField,
  }
})