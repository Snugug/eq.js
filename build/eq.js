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
(function (eqjs) {
  'use strict';

  function EQjs() {
    this.nodes = [];
    this.eqsLength = 0;
    this.widths = [];
    this.points = [];
  }

  //////////////////////////////
  // Request Animation Frame
  //////////////////////////////
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  var frames;
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    frames = window[vendors[x] + 'RequestAnimationFrame'];
  }

  if (!frames) {
    frames = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  //////////////////////////////
  // Debounce
  // Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
  //////////////////////////////
  // var debounce = function (func, wait, immediate) {
  //   var timeout;
  //   return function () {
  //     var context = this, args = arguments;
  //     var later = function () {
  //       timeout = null;
  //       if (!immediate) {
  //         func.apply(context, args);
  //       }
  //     };
  //     var callNow = immediate && !timeout;
  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);
  //     if (callNow) {
  //       func.apply(context, args);
  //     }
  //   };
  // };

  //////////////////////////////
  // Read
  //////////////////////////////
  EQjs.nodeReads = function (load) {
    var widths = [], points = [], i;

    for (i = 0; i < EQjs.nodesLength; i++) {
      widths.push(EQjs.nodes[i].offsetWidth);
      try {
        points.push(JSON.parse(EQjs.nodes[i].getAttribute('eq-pts')));
      }
      catch (e) {
        points.push({});
      }
    }

    EQjs.widths = widths;
    EQjs.points = points;

    if (load) {
      EQjs.nodeWrites();
    }
    else {
      frames(EQjs.nodeWrites);
    }
  };

  EQjs.nodeWrites = function () {
    var i;

    for (i = 0; i < EQjs.nodesLength; i++) {
      // Set object width to found width
      var objWidth = EQjs.widths[i];
      var obj = EQjs.nodes[i];
      var eqPts = EQjs.points[i];

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

  //////////////////////////////
  // Refresh Nodes
  // Refreshes the list of nodes for eqjs to work with
  //////////////////////////////
  EQjs.refreshNodes = function () {
    EQjs.nodes = document.querySelectorAll('[eq-pts]');
    EQjs.nodesLength = EQjs.nodes.length;
  };

  //////////////////////////////
  // Sort Object
  // Sorts a simple object (key: value) by value and returns a sorted object
  //////////////////////////////
  EQjs.sortObj = function (obj) {
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

  //////////////////////////////
  // Window Onload
  //
  // Fires on load
  //////////////////////////////
  window.onload = function () {
    EQjs.refreshNodes();
    EQjs.nodeReads(true);
  };

  //////////////////////////////
  // Window Resize
  //
  // Loop over each `eq-pts` element and pass to eqState
  //////////////////////////////
  window.onresize = function () {
    EQjs.refreshNodes();
    frames(EQjs.nodeReads);
  };

  // We only ever want there to be
  // one instance of EQjs in an app
  eqjs = eqjs || new EQjs();

  // Expose 'eqjs'
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = eqjs;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return eqjs;
    });
  } else {
    window.eqjs = eqjs;
  }
})(window.eqjs);