define(['core/maths', 'uuid'], function(maths, UUID) {

  function Particle(name) {
    console.log(UUID);
    this.id = UUID();
    this.name = name;
  }

  return Particle;
})