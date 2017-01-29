define(['core/maths', 'uuid'], function(maths, UUID) {

  function Particle(name) {
    this.id = UUID();
    this.name = name;
  }

  return Particle;
})