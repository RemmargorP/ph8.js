define(function() {
  function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  Vector3.prototype.add = function(v) {
    // if (!(v instanceof Vector3)) throw new Error(JSON.stringify(v) + ' is not a Vector3!'); // safety ??

    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  Vector3.prototype.sub = function(v) {
    // if (!(v instanceof Vector3)) throw new Error(JSON.stringify(v) + ' is not a Vector3!'); // safety ??

    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  Vector3.prototype.mul = function(d) {
    return new Vector3(this.x * d, this.y * d, this.z * d);
  }

  Vector3.prototype.len = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  }

  Vector3.prototype.norm = function(l) {
    if (this.len() == 0) return new Vector3();

    var to = l || 1;
    return this.mul(1 / this.len());
  }

  Vector3.prototype.neg = function() {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  Vector3.prototype.toString = function() {
    return '(x = ' + this.x.toFixed(4) + '; y = ' + this.y.toFixed(4) + '; z = ' + this.z.toFixed(4) + ')';
  }
  Vector3.prototype.copy = function() {
    return new Vector3(this.x, this.y, this.z);
  }

  return {
    Vector3: Vector3
  }
})