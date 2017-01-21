define(['core/maths'], function(maths) {
  function Particle(position, velocity, mass, q) {
    this.position = position || maths.Vector3();
    this.velocity = velocity || maths.Vector3();
    this.mass = mass || 1;
    this.q = q || 0;
  }

  return {
    Particle: Particle,
  }
})