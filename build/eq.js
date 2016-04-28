/*
 * The global eqjs object that contains all eq.js functionality.
 *
 * eqjs.nodes - List of all nodes to act upon when eqjs.states is called
 * eqjs.nodesLength - Number of nodes in eqjs.nodes
 *
 * eqjs.refreshNodes - Call this function to refresh the list of nodes that eq.js should act on
 * eqjs.sortObj - Sorts a key: value object based on value
 * eqjs.query - Runs through all nodes and finds their widths and points
 * eqjs.nodeWrites - Runs through all nodes and writes their eq status
 */
(function (eqjs) {
  'use strict';

  function EQjs() {
    this.nodes = [];
    this.eqsLength = 0;
    this.widths = [];
    this.points = [];
    this.callback = undefined;
  }

  /*
   * Add event (cross browser)
   * From http://stackoverflow.com/a/10150042
   */
  function addEvent(elem, event, fn) {
    if (elem.addEventListener) {
      elem.addEventListener(event, fn, false);
    } else {
      elem.attachEvent('on' + event, function () {
        // set the this pointer same as addEventListener when fn is called
        return (fn.call(elem, window.event));
      });
    }
  }

  /*
   * Parse Before
   *
   * Reads `:before` content and splits it at the comma
   * From http://jsbin.com/ramiguzefiji/1/edit?html,css,js,output
   */
  function parseBefore(elem) {
    return window.getComputedStyle(elem, ':before').getPropertyValue('content').slice(1, -1);
  }

  /*
   * Merges two node lists together.
   *
   * From http://stackoverflow.com/questions/914783/javascript-nodelist/17262552#17262552
   */
  var mergeNodes = function(a, b) {
    return [].slice.call(a).concat([].slice.call(b));
  };

  /*
   * Query
   *
   * Reads nodes and finds the widths/points
   *  nodes - optional, an array or NodeList of nodes to query
   *  callback - Either boolean (`true`/`false`) to force a normal callback, or a function to use as a callback once query and nodeWrites have finished.
   */
  EQjs.prototype.query = function (nodes, callback) {
    var proto = Object.getPrototypeOf(eqjs);
    var length;

    if (callback && typeof(callback) === 'function') {
      proto.callback = callback;
    }

    if (nodes && typeof(nodes) !== 'number') {
      length = nodes.length;
    }
    else {
      nodes = proto.nodes;
      length = proto.nodesLength;
    }
    var widths = [], points = [], i;

    for (i = 0; i < length; i++) {
      var rect = nodes[i].getBoundingClientRect();
      var width = rect.width;
      if (width === undefined) {
          width = rect.right - rect.left;
      }
      widths.push(width);
      try {
        points.push(proto.sortObj(nodes[i].getAttribute('data-eq-pts')));
      }
      catch (e) {
        try {
          points.push(proto.sortObj(parseBefore(nodes[i])));
        }
        catch (e2) {
          points.push([{
            key: '',
            value: 0
          }]);
        }
      }
    }

    proto.widths = widths;
    proto.points = points;

    if (nodes && typeof(nodes) !== 'number') {
      proto.nodeWrites(nodes, widths, points);
    }
    else if (callback && typeof(callback) !== 'function') {
      proto.nodeWrites();
    }
    else {
      window.requestAnimationFrame(proto.nodeWrites);
    }
  };

  /*
   * NodeWrites
   *
   * Writes the data attribute to the object
   *  nodes - optional, an array or NodeList of nodes to query
   *  widths - optional, widths of nodes to use. Only used if `nodes` is passed in
   *  points - optional, points of nodes to use. Only used if `nodes` is passed in
   */
  EQjs.prototype.nodeWrites = function (nodes) {
    var i,
        j,
        k,
        length,
        callback,
        eqResizeEvent,
        eqState,
        proto = Object.getPrototypeOf(eqjs),
        widths = proto.widths,
        points = proto.points;

    if (nodes && typeof(nodes) !== 'number') {
      length = nodes.length;
    }
    else {
      nodes = proto.nodes;
      length = proto.nodesLength;
    }

    for (i = 0; i < length; i++) {
      // Set object width to found width
      var objWidth = widths[i];
      var obj = nodes[i];
      var eqPts = points[i];
      var eqStates = [];

      // Get keys for states
      var eqPtsLength = eqPts.length;

      // Be greedy for smallest state
      if (objWidth < eqPts[0].value) {
        eqState = null;
      }
      // Be greedy for largest state
      else if (objWidth >= eqPts[eqPtsLength - 1].value) {
        for (k = 0; k < eqPtsLength; k++) {
          eqStates.push(eqPts[k].key);
        }
        eqState = eqStates.join(' ');
      }
      // Traverse the states if not found
      else {
        for (j = 0; j < eqPtsLength; j++) {
          var current = eqPts[j];
          var next = eqPts[j + 1];
          eqStates.push(current.key);

          if (j === 0 && objWidth < current.value) {
            eqState = null;
            break;
          }
          else if (next !== undefined && next.value === undefined) {
            eqStates.push(next.key);
            eqState = eqStates.join(' ');
            break;
          }
          else if (objWidth >= current.value && objWidth < next.value) {
            eqState = eqStates.join(' ');
            break;
          }
        }
      }

      // Determine what to set the attribute to
      if (eqState === null) {
        obj.removeAttribute('data-eq-state');
      }
      else {
        obj.setAttribute('data-eq-state', eqState);
      }
      // Set the details of `eqResize`
      eqResizeEvent = new CustomEvent('eqResize', {'detail': eqState, 'bubbles': true});

      // Fire resize event
      obj.dispatchEvent(eqResizeEvent);
    }

    // Run Callback
    if (proto.callback) {
      callback = proto.callback;
      proto.callback = undefined;
      callback(nodes);
    }
  };

  /*
   * Refresh Nodes
   * Refreshes the list of nodes for eqjs to work with
   */
  EQjs.prototype.refreshNodes = function () {
    var proto = Object.getPrototypeOf(eqjs),
        cssNodes = [];

    proto.nodes = document.querySelectorAll('[data-eq-pts]');

    cssNodes = parseBefore(document.querySelector('html')).split(', ');
    cssNodes.forEach(function (v) {
      if (v !== '') {
        proto.nodes = mergeNodes(proto.nodes, document.querySelectorAll(v));
      }
    });


    proto.nodesLength = proto.nodes.length;
  };

  /*
   * Sort Object
   * Sorts a simple object (key: value) by value and returns a sorted object
   */
  EQjs.prototype.sortObj = function (obj) {
    var arr = [];

    var objSplit = obj.split(',');

    for (var i = 0; i < objSplit.length; i++) {
      var sSplit = objSplit[i].split(':');
      arr.push({
        'key': sSplit[0].replace(/^\s+|\s+$/g, ''),
        'value': parseFloat(sSplit[1])
      });
    }

    return arr.sort(function (a, b) { return a.value - b.value; });
  };

  /**
    * JavaScript constructor
    * Adds `data-eq-pts` attribute as constructor for JavaScript
    */
  EQjs.prototype.definePts = function (node, points) {
    points = points ? points : {};

    points = JSON.stringify(points);
    points = points.substring(1, points.length - 1);
    points = points.replace(/:/g, ': ');
    points = points.replace(/,/g, ', ');
    points = points.replace(/"/g, '');

    node.setAttribute('data-eq-pts', points);

    return points;
  };

  /**
    * Query All Nodes
    * Runs refreshNodes and Query
  **/
  EQjs.prototype.all = function (cb) {
    var proto = Object.getPrototypeOf(eqjs);
    var hasCB = cb ? true : false;

    proto.refreshNodes();

    if (!hasCB) {
      window.requestAnimationFrame(proto.query);
    }
    else {
      proto.query(undefined, cb);
    }
  }

  /*
   * We only ever want there to be
   * one instance of EQjs in an app
   */
  eqjs = eqjs || new EQjs();

  /*
   * Document Loaded
   *
   * Fires on document load; for HTML based EQs
   */
  addEvent(window, 'DOMContentLoaded', function () {
    eqjs.all(false);
  });

  /*
   * Window Loaded
   */
  addEvent(window, 'load', function () {
    eqjs.all(true);
  });

  /*
   * Window Resize
   *
   * Loop over each `eq-pts` element and pass to eqState
   */
  addEvent(window, 'resize', function () {
    eqjs.all(true);
  });

  // Expose 'eqjs'
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = eqjs;
  } else if (typeof define === 'function' && define.amd) {
    define('eqjs', function () {
      return eqjs;
    });
  } else {
    window.eqjs = eqjs;
  }
})(window.eqjs);
