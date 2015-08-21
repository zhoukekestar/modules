
// For android 4.4-
if (HTMLElement && !HTMLElement.prototype.remove) {
  HTMLElement.prototype.remove = function() {
    this.parentNode.removeChild(this);
  };
}
