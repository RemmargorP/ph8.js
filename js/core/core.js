define(function() {
  function Core() {
    this.particles = {};
    this.fields = {};

    this.addParticle = function(particle) {
      this.particles[particle.name] = particle;
    }
  }

  return {
    Core: Core,
  }
})