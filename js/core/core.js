define(['weaver', 'core/geometry', 'core/entities/field'], function(Weaver, Geometry, Fields) {
  function Core() {
    var that = this;

    this.particles = {};
    this.fields = {};

    this.time = 0;
    this.step = 0.001;
    this.running = false;
    this.simulateTil = 0; // time

    this.fabric = Weaver.fabric();

    for (var fg in Fields) {
      this.fabric.require(Fields[fg]);
    }
    this.fabric.require(Geometry.Vector3);

    this.addParticle = function(particle) {
      this.particles[particle.id] = particle;
    }
    this.addField = function(field) {
      this.fields[field.id] = field;
    }

    this.stop = function() {
      this.running = false;
    }

    this.continue = function() {
      if (this.simulateTil > this.time)
        this.running = true;
    }

    this.setSimulationEndingTime = function(time) {
      this.simulateTil = time;
    }

    this.setPrecision = function(deltaT) {
      if (deltaT > 0)
        this.step = deltaT;
    }

    this.simulateOne = function(data) {
      var fields = data[0], particle = data[1], deltaT = data[2];
      particle.position = new Vector3(particle.position.x, particle.position.y, particle.position.z);
      particle.velocity = new Vector3(particle.velocity.x, particle.velocity.y, particle.velocity.z);
      var force = new Vector3(0, 0, 0);
      for (key in fields) {
        fields[key][1].position = new Vector3(fields[key][1].position.x, fields[key][1].position.y, fields[key][1].position.z);
        fields[key][1].velocity = new Vector3(fields[key][1].velocity.x, fields[key][1].velocity.y, fields[key][1].velocity.z);

        //console.log(fields[key], this.GravityField.prototype.impactOn);
        force = force.add(this[fields[key][0]].prototype.impactOn(particle, fields[key][1]));
      }
      var acceleration = force.mul(1 / particle.mass);
      var deltaV = acceleration.mul(deltaT);
      //console.log(deltaV);
      particle.velocity = particle.velocity.add(deltaV);
      return particle;
    }

    this.simulate = async function() {
      var prevLogTime = this.time-1000;
      while (1) {
        await (function() { return new Promise(resolve => setTimeout(resolve, 100))})();
        console.log('Waiting...');
        while (this.running && this.time < this.simulateTil) {
          if (this.time - prevLogTime > 1) {
            console.log('Running ' + this.time + '/' + this.simulateTil);
            prevLogTime = this.time;
          }
          var results = [], data = [], packedFields = [];
          for (var key in this.fields) {
            packedFields.push(this.fields[key].pack());
          }
          for (var key in this.particles) {
            var p = this.particles[key];
            data.push([packedFields, p.pack(), this.step]);
          }
          //console.log(data);
          //require(this.fields, 'fields').

          this.fabric.pass(data).map(this.simulateOne).then(function(nextstate) {
            results.push(nextstate);
          });
          this.time += this.step;
          await (async function() {
            while (results.length != this.particles.length);
          })
          for (var key in results) {
            this.particles[results[key].id].unpack(r);
          }
          for (var key in this.particles) {
            var p = this.particles[key];
            p.position = p.position.add(p.velocity.mul(this.step));
            p.updateHistory(this.time);
          }
        }
      }
    }
  }

  return {
    Core: Core,
  }
})