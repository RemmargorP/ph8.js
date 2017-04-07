define(['weaver', 'core/geometry', 'core/entities/field'], function(Weaver, Geometry, Fields) {
  function Core() {
    var that = this;

    this.particles = {};
    this.fields = {};

    this.time = 0;
    this.step = 0.001;
    this.running = false;
    this.simulateTil = 0; // time
    this.realTimePerStepMul = 1;

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

    this.simulateOne = function(particle, deltaT) {
      /*var fields = packedFields, particle = data[0], deltaT = data[1];
      particle.position = new Vector3(particle.position.x, particle.position.y, particle.position.z);
      particle.velocity = new Vector3(particle.velocity.x, particle.velocity.y, particle.velocity.z);
      */
      var force = new Geometry.Vector3(0, 0, 0);
      for (key in that.fields) {
        //console.log(fields[key], this.GravityField.prototype.impactOn);
        force = force.add(that.fields[key].impactOn(particle));
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
          var startTime = new Date();

          if (this.time - prevLogTime > 0.01) {
            //console.log('Running ' + this.time + '/' + this.simulateTil);
            prevLogTime = this.time;
            $('#clock').text('Current time: ' + this.time);
          }

          var curStep = this.step;
          for (var p1 in this.particles) {
            for (var p2 in this.particles) {
              if (p1 == p2) continue;
              var dist = this.particles[p1].position.sub(this.particles[p2].position).len();
              var speed = this.particles[p1].velocity.len() + this.particles[p2].velocity.len();

              if (speed > 1e-9) curStep = Math.min(curStep, dist / speed / 10);
            }
          }

          //var results = [], data = [], packedFields = [];
          /*for (var key in this.fields) {
            packedFields.push(this.fields[key].pack());
          }*/
          /*for (var key in this.particles) {
            var p = this.particles[key];
            data.push([p.pack(), curStep]);
          }*/

          //this.fabric.require(packedFields, 'packedFields');
          //console.log(data);
          //require(this.fields, 'fields').

          for (var key in this.particles) {
            this.simulateOne(this.particles[key], curStep);
          }

          /*await this.fabric.pass(data).map(this.simulateOne).then(function(nextstates) {
            results = nextstates;
          });*/
          this.time += curStep;
          //await (async function() {
          //  while (results.length != this.particles.length);
          //})
          //for (var key in results) {
          //  this.particles[results[key].id].unpack(results[key]);
          //}
          for (var key in this.particles) {
            var p = this.particles[key];
            p.position = p.position.add(p.velocity.mul(curStep));
            p.updateHistory(this.time);
            p.update();
          }

          var endTime = new Date();

          if (endTime - startTime < this.step * this.realTimePerStepMul) {
            await (function() { return new Promise(resolve => setTimeout(resolve, this.step * this.realTimePerStepMul - (endTime - startTime)))})();
          }
        }
        $('#clock').text('Current time: ' + this.time);
      }
    }

    this.save = function() {
    }
  }

  return {
    Core: Core,
  }
})