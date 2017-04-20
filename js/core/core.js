define(['core/geometry', 'core/entities/field', 'core/entities/particle'], function(Geometry, Fields, Particle) {
  function Core() {
    var that = this;

    this.particles = {};
    this.fields = {};
    this.diffcheck = {};

    this.configFields = [];

    this.time = 0;
    this.maxStep = 500;
    this.step = 1;
    this.running = false;
    this.simulateTil = 0;
    this.simulatePerRealSec = 1;
    this.precision = 1e-5;

    this.addParticle = function(particle) {
      this.particles[particle.id] = particle;
    };
    this.removeParticle = function(id) {
      for (var key in this.fields) {
        if (this.fields[key].source && this.fields[key].source.id == id) {
          delete this.fields[key];
        }
      }
      delete this.particles[id];
    };
    this.addField = function(field_id, particle_id) {
      var f;
      if (particle_id)
        f = new Fields[field_id](this.particles[particle_id]);
      else 
        f = new Fields[field_id]();

      this.fields[f.id] = f;
      this.configFields.push([field_id, particle_id])
    };

    this.stop = function() {
      this.running = false;
    };

    this.continue = function() {
      if (this.simulateTil > this.time)
        this.running = true;
    };

    this.setSimulationEndingTime = function(time) {
      this.simulateTil = time;
    };

    this.setPrecision = function(precision) {
      this.precision = precision;
    };

    this.simulateOne = function(particle, deltaT) {
      var force = new Geometry.Vector3(0, 0, 0);
      for (var key in that.fields) {
        force = force.add(that.fields[key].impactOn(particle));
      }
      var acceleration = force.mul(1 / particle.mass);

      particle.acceleration = acceleration;
      return particle;
    };

    this.serialize = function() {
      var data = {
        time: this.time,
        maxStep: this.maxStep,
        step: this.step,
        simulateTil: this.simulateTil,
        simulatePerRealSec: this.simulatePerRealSec,
        precision: this.precision,
        fields: [],
        particles: {}
      }

      for (var key in this.particles) {
        if (this.particles[key] && !this.particles[key].removed)
          data.particles[key] = this.particles[key].serialize(true);
      }

      for (var key in this.configFields) {
        if (this.particles[this.configFields[key][1]] && !this.particles[this.configFields[key][1]].removed)
          data.fields.push(this.configFields[key]);
      }

      return data;
    }

    this.deserialize = function(data) {
      console.log(data);
      that.time = data.time;
      that.maxStep = data.maxStep;
      that.step = data.step;
      that.simulateTil = data.simulateTil;
      that.simulatePerRealSec = data.simulatePerRealSec;
      that.precision = data.precision;

      for (var key in data.particles) {
        var p = new Particle();
        p.deserialize(data.particles[key]);
        console.log(p);
      }

    };

    this.simulate = async function() {
      var prevLogTime = new Date();
      var simulationStartTime = new Date();
      var stepIter = 0;
      while (1) {
        await (function() { return new Promise(resolve => setTimeout(resolve, 300))})(); // 0.3 sec sleep
        console.log('Waiting...');
        while (this.running && this.time < this.simulateTil) {
          stepIter++;

          var startTime = new Date();

          if (stepIter % 100 == 0) this.step = Math.min(this.step * 2, this.maxStep);

          var ok = false, firstTime = true;

          while (!ok) {
            var p, poss, p1, p2, vp1, vp2, pp1, pp2;
            if (firstTime) {
              for (var key in this.particles) {
                p = this.particles[key];

                p.restore = p.serialize();
                this.simulateOne(p, this.step);
              }
              for (var key in this.particles) {
                p = this.particles[key];

                p.position = p.position.add(p.velocity.mul(this.step)).add(p.acceleration.mul(this.step*this.step * 0.5));
                p.velocity = p.velocity.add(p.acceleration.mul(this.step));

                this.diffcheck[p.id] = p.serialize();
                p.deserialize(p.restore);
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
              p = this.particles[key];
              poss = this.diffcheck[p.id];

              pp1 = p.position;
              vp1 = p.velocity;

              pp2 = new Geometry.Vector3().deserialize(poss.position);
              vp2 = new Geometry.Vector3().deserialize(poss.velocity);

              if (p.position.sub(poss.position).len2() > this.precision*this.precision ||
                  p.velocity.sub(poss.velocity).len2() > this.precision*this.precision ||
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
            p.updateHistory(this.time);
            p.update();
          }

          if (startTime - prevLogTime > 1000) {
            prevLogTime = startTime;
            console.log(stepIter + ' Running ' + this.time + '/' + this.simulateTil + '   current step: ' + this.step + ' Real time elapsed: ' + 0.001 * (new Date() - simulationStartTime));
            $('#clock').text('Current time: ' + this.time);
          }

          var endTime = new Date();

          if (0.001 * (endTime - startTime) < this.simulatePerRealSec * this.step) {
            await (function() { return new Promise(resolve => setTimeout(resolve, this.step * this.simulatePerRealSec - 0.001*(endTime - startTime)))})();;
          }
        }
        $('#clock').text('Current time: ' + this.time.toFixed(4));
      }
      $('#clock').text('Current time: ' + this.time.toFixed(4));
    }

  }

  return {
    Core: Core,
  }
});