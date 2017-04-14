define(['weaver', 'core/geometry', 'core/entities/field'], function(Weaver, Geometry, Fields) {
  function Core() {
    var that = this;

    this.particles = {};
    this.fields = {};
    this.diffcheck = {};

    this.time = 0;
    this.maxStep = 0.05;
    this.step = 0.001;
    this.running = false;
    this.simulateTil = 0; // time
    this.realTimePerStepMul = 1;
    this.precision = 1e-5;

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

    this.setPrecision = function(precision) {
      this.precision = precision;
    }

    this.simulateOne = function(particle, deltaT) {
      /* MULTITHREAD 
      var fields = packedFields, particle = data[0], deltaT = data[1];
      particle.position = new Vector3(particle.position.x, particle.position.y, particle.position.z);
      particle.velocity = new Vector3(particle.velocity.x, particle.velocity.y, particle.velocity.z);
      */
      var force = new Geometry.Vector3(0, 0, 0);
      for (key in that.fields) {
        force = force.add(that.fields[key].impactOn(particle));
      }
      var acceleration = force.mul(1 / particle.mass);
      var deltaV = acceleration.mul(deltaT);

      particle.acceleration = acceleration;
      return particle;
    }

    this.simulate = async function() {
      var prevLogTime = new Date();
      var simulationStartTime = new Date();
      var stepIter = 0;
      while (1) {
        await (function() { return new Promise(resolve => setTimeout(resolve, 100))})();
        console.log('Waiting...');
        while (this.running && this.time < this.simulateTil) {
          stepIter++;

          var startTime = new Date();

          /* MULTITHREAD - too raw implementation, too slow
          var results = [], data = [], packedFields = [];
          for (var key in this.fields) {
            packedFields.push(this.fields[key].pack());
          }
          for (var key in this.particles) {
            var p = this.particles[key];
            data.push([p.pack(), curStep]);
          }

          this.fabric.require(packedFields, 'packedFields');
          console.log(data);
          require(this.fields, 'fields');
          await this.fabric.pass(data).map(this.simulateOne).then(function(nextstates) {
            results = nextstates;
          });

          await (async function() {
            while (results.length != this.particles.length);
          })
          for (var key in results) {
            this.particles[results[key].id].unpack(results[key]);
          }
          */

          if (stepIter % 200 == 0) this.step = Math.min(this.step * 2, this.maxStep);

          var ok = false, firstTime = true;

          while (!ok) {
            var p, poss;
            if (firstTime) {
              for (var key in this.particles) {
                p = this.particles[key];

                p.restore = p.pack();
                this.simulateOne(p, this.step);
              }
              for (var key in this.particles) {
                p = this.particles[key];

                p.position = p.position.add(p.velocity.mul(this.step)).add(p.acceleration.mul(this.step*this.step * 0.5));
                p.velocity = p.velocity.add(p.acceleration.mul(this.step));

                this.diffcheck[p.id] = p.pack();
                p.unpack(p.restore);
              }
              firstTime = false;
            }
            for (var key in this.particles) {
              p = this.particles[key];
              this.simulateOne(p, this.step / 2);
            }
            for (var key in this.particles) {
              p = this.particles[key];
              p.position = p.position.add(p.velocity.mul(this.step/2)).add(p.acceleration.mul((this.step/2)*(this.step/2) * 0.5));
              p.velocity = p.velocity.add(p.acceleration.mul(this.step/2));
            }
            for (var key in this.particles) {
              p = this.particles[key];
              this.simulateOne(p, this.step / 2);
            }
            for (var key in this.particles) {
              p = this.particles[key];
              p.position = p.position.add(p.velocity.mul(this.step/2)).add(p.acceleration.mul((this.step/2)*(this.step/2) * 0.5));
              p.velocity = p.velocity.add(p.acceleration.mul(this.step/2));
            }

            ok = true;

            for (var key in this.particles) {
              p = this.particles[key].pack();
              poss = this.diffcheck[p.id];

              if (p.position.sub(poss.position).len() > this.precision ||
                  p.velocity.sub(poss.velocity).len() > this.precision ||
                  Math.abs(p.charge - poss.charge) > this.precision ||
                  Math.abs(p.mass - poss.mass) > this.precision) {
                ok = false;
                this.step /= 2;
                firstTime = true;
                break;
              }
            }
          }
          
          this.time += this.step;
          
          for (var key in this.particles) {
            var p = this.particles[key];
            p.position = p.position.add(p.velocity.mul(this.step));
            p.updateHistory(this.time);
            p.update();
          }

          if (startTime - prevLogTime > 1000) {
            prevLogTime = startTime;
            console.log(stepIter + ' Running ' + this.time + '/' + this.simulateTil + '   current step: ' + this.step + ' Real time elapsed: ' + 0.001 * (new Date() - simulationStartTime));
            $('#clock').text('Current time: ' + this.time);
          }

          var endTime = new Date();

          if (endTime - startTime < 1000 * this.realTimePerStepMul) {
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