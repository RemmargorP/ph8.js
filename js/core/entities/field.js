define(function() {
  function Field(source) {
    this.source = source;
    this.impactOn = function(current, nextstate) {}
  }

  return {
    Field: Field
  }
})