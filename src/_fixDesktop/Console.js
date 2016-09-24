
// For some IE that have no console object.
if (!window.console) {
  window.console = {};
  window.console.debug  = function() {}
  window.console.log    = function() {}
  window.console.info   = function() {}
  window.console.warn   = function() {}
  window.console.error  = function() {}
}
