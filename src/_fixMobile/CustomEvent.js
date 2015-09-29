/**
 * WHY?
 * @see http://caniuse.com/#feat=customevent
 *
 * HOW?
 * @see  https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Event/polyfill.js
 *
 */

(function(global){

  var ok = function() {
    if (!('Event' in global)) return false;
    if (typeof global.Event === 'function') return true;

    try {

      // In IE 9 and 10, the Event object exists but cannot be instantiated
      new Event('click');
      return true;
    } catch(e) {
      return false;
    }
  }

  if (!ok) {

    global.Event = function Event(type, eventInitDict) {
      if (!type) {
        throw new Error('Not enough arguments');
      }

      var
      event = document.createEvent('Event'),
      bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false,
      cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

      event.initEvent(type, bubbles, cancelable);

      return event;
    };
  }

})(window)
