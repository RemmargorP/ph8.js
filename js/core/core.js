define(['weaver'], function(Weaver) {
  function Core() {
    var that = this;

    this.particles = {};
    this.fields = {};

    this.time = 0;
    this.step = 0.001;
    this.running = false;
    this.simulateTil = 0; // time

    this.addParticle = function(particle) {
      this.particles[particle.id] = particle;
    }

    this.stop = function() {
      this.running = false;
    }

    this.continue = function() {
      if (this.simulateTo > this.time)
        this.running = true;
    }

    this.setSimulationStopTime = function(time) {
      this.simulateTil = time;
      this.continue();
    }

    this.setPrecision = function(deltaT) {
      if (deltaT > 0)
        this.step = deltaT;
    }

    this.simulate = function() {
    }
  }

  return {
    Core: Core,
  }
})