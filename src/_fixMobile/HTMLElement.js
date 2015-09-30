
// For android 4.4-
if (HTMLElement && !HTMLElement.prototype.remove) {
  HTMLElement.prototype.remove = function() {
    this.parentNode.removeChild(this);
  };
}

if (HTMLElement && !HTMLElement.prototype.click) {
  HTMLElement.prototype.click = function() {
    this.dispatchEvent(new Event('click', {bubbles: true}));
  }
}
