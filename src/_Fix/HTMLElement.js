// For IE 11
// Element has no remove but removeNode method.
if (HTMLElement && HTMLElement.prototype.removeNode) {
  HTMLElement.prototype.remove = HTMLElement.prototype.removeNode;
}
