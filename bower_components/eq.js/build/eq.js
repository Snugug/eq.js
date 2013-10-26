//////////////////////////////
// Define eqjs
//////////////////////////////
var eqjs = {};
eqjs.nodes = [];
eqjs.eqsLength = 0;

//////////////////////////////
// Debounce
// Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
//////////////////////////////
eqjs.debounce = function (func, wait, immediate) {
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
// Refresh Nodes
// Refreshes the list of nodes for eqjs to work with
//////////////////////////////
eqjs.refreshNodes = function () {
  eqjs.nodes = document.querySelectorAll('[eq-pts]');
  eqjs.eqsLength = eqjs.nodes.length;
};

//////////////////////////////
// Sort Object
// Sorts a simple object (key: value) by value and returns a sorted object
//////////////////////////////
eqjs.sortObj = function (obj) {
  var arr = [];
  var rv = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        'key': prop,
        'value': obj[prop]
      });
    }
  }
  arr.sort(function (a, b) { return a.value - b.value; });

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    rv[item.key] = item.value;
  }
  return rv;
};

eqjs.states = function () {
  // Read offset width of all nodes
  var width = [], eqPtsValues = [], eqPts, i;

  for (i = 0; i < eqjs.eqsLength; i++) {
    width.push(eqjs.nodes[i].offsetWidth);
    eqPts = {};
    try {
      eqPts = JSON.parse(eqjs.nodes[i].getAttribute('eq-pts'));
      eqPtsValues.push(eqPts);
    }
    catch (e) {
      console.log('Invalid JSON. Remember to wrap your attribute in single quotes (\') and your keys in double quotes (")');
    }
  }

  // Update nodes
  for (i = 0; i < eqjs.eqsLength; i++) {
    // Set object width to found width
    var objWidth = width[i];
    var obj = eqjs.nodes[i];
    eqPts = eqPtsValues[i];

    // Get keys for states
    var eqStates = Object.keys(eqPts);
    var eqPtsLength = eqStates.length;

    // Get first and last key
    var firstKey = eqStates[0];
    var lastKey = eqStates[eqPtsLength - 1];

    // Be greedy for smallest state
    if (objWidth < eqPts[firstKey]) {
      obj.removeAttribute('eq-state');
    }
    // Be greedy for largest state
    else if (objWidth >= eqPts[lastKey]) {
      obj.setAttribute('eq-state', lastKey);
    }
    // Traverse the states if not found
    else {
      for (var j = 0; j < eqPtsLength; j++) {
        var thisKey = eqStates[j];
        var nextKey = eqStates[j + 1];

        if (j === 0 && objWidth < eqPts[thisKey]) {
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
};



(function () {
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
    eqjs.refreshNodes();

    eqjs.states();
  };

  //////////////////////////////
  // Window Resize
  //
  // Loop over each `eq-pts` element and pass to eqState
  //////////////////////////////
  window.onresize = eqjs.debounce(function () {
    eqjs.states();
  }, 20);
})(eqjs);