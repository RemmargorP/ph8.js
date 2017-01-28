define(function() {
  function Core() {
    this.particles = {};
    this.fields = {};

    this.addParticle = function(particle) {
      this.particles[particle.id] = particle;
    }
  }

  return {
    Core: Core,
  }
})