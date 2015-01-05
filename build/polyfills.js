/**
  * Polyfills for eq.js
**/
(function () {
  /*
   * Object.getPrototypeOf Polyfill
   * From http://stackoverflow.com/a/15851520/703084
   */
  if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = ''.__proto__ === String.prototype ? function (object) {
      return object.__proto__;
    }
    : function (object) {
      // May break if the constructor has been tampered with
      return object.constructor.prototype;
    };
  }

  /*
   * Request Animation Frame Polyfill
   *
   * Written by  Erik Möller and Paul Irish
   * From http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
   */
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      element = element;
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  /**
    * DOMContentLoaded Polyfill
    *
    * Adapted from the Financial Times polyfill service
    * https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Event.DOMContentLoaded/polyfill.js
  **/
  if (!('addEventListener' in window)) {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === 'complete') {
        document.dispatchEvent(new Event('DOMContentLoaded', {
          bubbles: true
        }));
      }
    });
  }

  /**
    * getComputedStyle Polyfill
    *
    * Adapted from the Financial Times polyfill service
    * https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/getComputedStyle/polyfill.js
  **/
  if (!('getComputedStyle' in window)) {
    (function (global) {
      function getComputedStylePixel(element, property, fontSize) {
        var
        // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.
        value = element.document && element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
        size = value[1],
        suffix = value[2],
        rootSize;

        fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
        rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

        return suffix == '%' ? size / 100 * rootSize :
               suffix == 'cm' ? size * 0.3937 * 96 :
               suffix == 'em' ? size * fontSize :
               suffix == 'in' ? size * 96 :
               suffix == 'mm' ? size * 0.3937 * 96 / 10 :
               suffix == 'pc' ? size * 12 * 96 / 72 :
               suffix == 'pt' ? size * 96 / 72 :
               size;
      }

      function setShortStyleProperty(style, property) {
        var
        borderSuffix = property == 'border' ? 'Width' : '',
        t = property + 'Top' + borderSuffix,
        r = property + 'Right' + borderSuffix,
        b = property + 'Bottom' + borderSuffix,
        l = property + 'Left' + borderSuffix;

        style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [ style[t] ] :
                           style[t] == style[b] && style[l] == style[r] ? [ style[t], style[r] ] :
                           style[l] == style[r] ? [ style[t], style[r], style[b] ] :
                           [ style[t], style[r], style[b], style[l] ]).join(' ');
      }

      // <CSSStyleDeclaration>
      function CSSStyleDeclaration(element) {
        var
        style = this,
        currentStyle = element.currentStyle,
        fontSize = getComputedStylePixel(element, 'fontSize'),
        unCamelCase = function (match) {
          return '-' + match.toLowerCase();
        },
        property;

        for (property in currentStyle) {
          Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

          if (property == 'width') {
            style[property] = element.offsetWidth + 'px';
          } else if (property == 'height') {
            style[property] = element.offsetHeight + 'px';
          } else if (property == 'styleFloat') {
            style.float = currentStyle[property];
          } else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
            style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
          } else if (/^outline/.test(property)) {
            // errors on checking outline
            try {
              style[property] = currentStyle[property];
            } catch (error) {
              style.outlineColor = currentStyle.color;
              style.outlineStyle = style.outlineStyle || 'none';
              style.outlineWidth = style.outlineWidth || '0px';
              style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
            }
          } else {
            style[property] = currentStyle[property];
          }
        }

        setShortStyleProperty(style, 'margin');
        setShortStyleProperty(style, 'padding');
        setShortStyleProperty(style, 'border');

        style.fontSize = Math.round(fontSize) + 'px';
      }

      CSSStyleDeclaration.prototype = {
        constructor: CSSStyleDeclaration,
        // <CSSStyleDeclaration>.getPropertyPriority
        getPropertyPriority: function () {
          throw new Error('NotSupportedError: DOM Exception 9');
        },
        // <CSSStyleDeclaration>.getPropertyValue
        getPropertyValue: function (property) {
          return this[property.replace(/-\w/g, function (match) {
            return match[1].toUpperCase();
          })];
        },
        // <CSSStyleDeclaration>.item
        item: function (index) {
          return this[index];
        },
        // <CSSStyleDeclaration>.removeProperty
        removeProperty: function () {
          throw new Error('NoModificationAllowedError: DOM Exception 7');
        },
        // <CSSStyleDeclaration>.setProperty
        setProperty: function () {
          throw new Error('NoModificationAllowedError: DOM Exception 7');
        },
        // <CSSStyleDeclaration>.getPropertyCSSValue
        getPropertyCSSValue: function () {
          throw new Error('NotSupportedError: DOM Exception 9');
        }
      };

      // <Global>.getComputedStyle
      global.getComputedStyle = function getComputedStyle(element) {
        return new CSSStyleDeclaration(element);
      };
    })(this);
  }

  /**
    * Array.prototype.forEach Polyfill
    *
    * Adapted from the Financial Times polyfill service
    * https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Array.prototype.forEach/polyfill.js
  **/

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback) {
      if (this === undefined || this === null) {
        throw new TypeError(this + 'is not an object');
      }

      if (!(callback instanceof Function)) {
        throw new TypeError(callback + ' is not a function');
      }

      var
      object = Object(this),
      scope = arguments[1],
      arraylike = object instanceof String ? object.split('') : object,
      length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0,
      index = -1,
      result = [],
      element;

      while (++index < length) {
        if (index in arraylike) {
          callback.call(scope, arraylike[index], index, object);
        }
      }
    };
  }
}());
