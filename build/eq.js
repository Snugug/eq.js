//////////////////////////////
// eq.js
// The global eqjs object that contains all eq.js functionality.
//
// eqjs.nodes - List of all nodes to act upon when eqjs.states is called
// eqjs.nodesLength - Number of nodes in eqjs.nodes
//
// eqjs.debounce - Debounce function, used for capturing multiple fires of an event like window.onresize
// eqjs.refreshNodes - Call this function to refresh the list of nodes that eq.js should act on
// eqjs.sortObj - Sorts a key: value object based on value
// eqjs.states - Runs through all nodes in eqjs.nodes and determines their eq state
//////////////////////////////
var eqjs = {
  //////////////////////////////
  // EQ nodes and length of node list
  //////////////////////////////
  nodes: [],
  eqsLength: 0,
  //////////////////////////////
  // Debounce
  // Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
  //////////////////////////////
  debounce: function (func, wait, immediate) {
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
  },
  //////////////////////////////
  // Refresh Nodes
  // Refreshes the list of nodes for eqjs to work with
  //////////////////////////////
  refreshNodes: function () {
    eqjs.nodes = document.querySelectorAll('[eq-pts]');
    eqjs.nodesLength = eqjs.nodes.length;
  },
  //////////////////////////////
  // Sort Object
  // Sorts a simple object (key: value) by value and returns a sorted object
  //////////////////////////////
  sortObj: function (obj) {
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
  },
  //////////////////////////////
  // Element States
  // This function will run through all nodes that have Element Query points, will determine their width, then determine what state should apply.
  //////////////////////////////
  readWidth: function (node) {
    window.fastdom.read(function () {
      var width = node.offsetWidth;
      var nodeJSON = eqjs.sortObj(JSON.parse(node.getAttribute('eq-pts')));

      var eqStates = Object.keys(nodeJSON);
      var eqPtsLength = eqStates.length;

      // Get first and last key
      var firstKey = eqStates[0];
      var lastKey = eqStates[eqPtsLength - 1];

      // Be greedy for smallest state
      if (width < nodeJSON[firstKey]) {
        window.fastdom.write(function () {
          node.removeAttribute('eq-state');
        });
      }
      // Be greedy for largest state
      else if (width >= nodeJSON[lastKey]) {
        window.fastdom.write(function () {
          node.setAttribute('eq-state', lastKey);
        });
      }
      // Traverse the states if not found
      else {
        window.fastdom.write(function () {

          for (var j = 0; j < eqPtsLength; j++) {
            var thisKey = eqStates[j];
            var nextKey = eqStates[j + 1];

            if (j === 0 && width < nodeJSON[thisKey]) {
              node.removeAttribute('eq-state');
              break;
            }

            if (nextKey === undefined) {
              node.setAttribute('eq-state', thisKey);
              break;
            }

            if (width >= nodeJSON[thisKey] && width < nodeJSON[nextKey]) {
              node.setAttribute('eq-state', thisKey);
              break;
            }
          }
        });
      }
    });
  },

  states: function () {
    // Read offset width of all nodes
    var i;

    for (i = 0; i < eqjs.nodesLength; i++) {
      eqjs.readWidth(eqjs.nodes[i]);
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