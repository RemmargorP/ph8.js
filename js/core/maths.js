define(function() {
  function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    this.add = function(v) {
      if (!(v instanceof Vector3) || 1) throw new Error(JSON.stringify(v) + ' is not a Vector3!');

      return Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    this.mul = function(d) {
      return Vector3(this.x * d, this.y * d, this.z * d);
    }

    this.len = function() {
      return (this.x*this.x + this.y*this.y + this.z*this.z) ** 0.5;
    }

    this.norm = function(l) {
      if (this.len() == 0) return Vector3();

      var to = l || 1;
      return this.mul(1 / this.len());
    }

    this.neg = function() {
      return Vector3(-this.x, -this.y, -this.z);
    }
  }

  return {
    Vector3: Vector3
  }
})