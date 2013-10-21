(function () {
  var eqs = [];
  var eqsLength = 0;

  //////////////////////////////
  // Debounce
  // Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
  //////////////////////////////
  var debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  //////////////////////////////
  // Window Load
  //
  // Grab all DOM elements with an `eq-pts` attribute
  // Find how many items there are
  // Save both to annon-scoped variables
  //
  // Loop over each and pass to eqState
  //////////////////////////////
  window.onload = function () {
    eqs = document.querySelectorAll('[eq-pts]');
    eqsLength = eqs.length;

    for (var i = 0; i < eqsLength; i++) {
      eqState(eqs[i]);
    }
  };

  //////////////////////////////
  // Window Resize
  //
  // Loop over each `eq-pts` element and pass to eqState
  //////////////////////////////
  window.onresize = debounce(function () {
    console.time("Dom update");
    for (var i = 0; i < eqsLength; i++) {
      eqState(eqs[i]);
    }
    console.timeEnd("Dom update");
  }, 20);

  //////////////////////////////
  // eqState Function
  //
  // @obj - A node element
  //
  // Finds with of @obj, transforms `eq-pts` attribute into JSON, reads through JSON to determine `min-width`, sets `eq-state`
  //////////////////////////////
  var eqState = function (obj) {
    var objWidth = obj.offsetWidth;
    // var objHeight = obj.offsetHeight;

    var eqPts = obj.getAttribute('eq-pts');

    try {
      eqPts = JSON.parse(eqPts);

      var eqStates = Object.keys(eqPts);
      var eqPtsLength = eqStates.length;

      var firstKey = eqStates[0];
      var lastKey = eqStates[eqPtsLength - 1];

      if (objWidth < eqPts[firstKey]) {
        obj.removeAttribute('eq-state');
      }
      else if (objWidth >= eqPts[lastKey]) {
        obj.setAttribute('eq-state', lastKey);
      }
      else {
        for (var i = 0; i < eqPtsLength; i++) {
          var thisKey = eqStates[i];
          var nextKey = eqStates[i + 1];

          if (i === 0 && objWidth < eqPts[thisKey]) {
            obj.removeAttribute('eq-state');
            break;
          }

          if (nextKey === undefined) {
            obj.setAttribute('eq-state', thisKey);
            break;
          }

          if (objWidth >= eqPts[thisKey] && objWidth < eqPts[nextKey]) {
            obj.setAttribute('eq-state', thisKey);
            break;
          }
        }
      }
    }
    catch (e) {
      console.log('Invalid JSON. Remember to wrap your attribute in single quotes (\') and your keys in double quotes (")');
    }
  };
})();