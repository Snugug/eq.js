# eq.js [![Build Status](https://travis-ci.org/Snugug/eq.js.svg)](https://travis-ci.org/Snugug/eq.js) [![Coverage Status](https://coveralls.io/repos/Snugug/eq.js/badge.svg?branch=1.x.x&service=github)](https://coveralls.io/github/Snugug/eq.js?branch=1.x.x) [![Code Climate](https://codeclimate.com/github/Snugug/eq.js/badges/gpa.svg)](https://codeclimate.com/github/Snugug/eq.js) [![Bower version](https://badge.fury.io/bo/eq.js.svg)](https://github.com/Snugug/eq.js/releases/latest)
### Element queries, fast and light

Element queries are the "holy grail" of responsive web design, allowing you to create a single component that can be dropped into any position in any layout and have them respond appropriately. Unfortunately, due to some hard-to-deal-with chicken-and-egg cases, especially involving inline elements, it's unlikely that element queries will make it into browsers any time soon.

**eq.js** aims to be a relatively easy to use drop-in solution to JavaScript powered element queries. Weighing in at about 2.6KB minified, around 1.1KB gzipped, and requiring no external dependencies, **eq.js** sets itself apart through size, speed, and ease of use. Simply drop **eq.js** on to your site and set the `eq-pts` attribute of your element (or set your points in Sass) and you're ready to go!

## Installation

Installation is super easy. You can either pull down a copy from GitHub here, or you can install from [Bower](http://bower.io):

```bash
bower install eq.js --save
```

Then, add either `eq.js` or `eq.min.js` to your HTML, and you're ready to rock!

## Usage

In order to use **eq.js**, you need to include `eq.js` on your site. Setting up element queries can be done in one of two ways: the first is to set up a `data-eq-pts` attribute on your desired element and the second is to use the `eq-pts` mixin in Sass. The first way is preferred, as it is faster for JavaScript to parse and can fire on `DOMContentLoaded` whereas the second way is slower and can only be fired on window `load`, increasing the likelihood of a flash of unstyled content.

Both methods have you write `key: value` pairs, with the key being the human-readable name of the applied state and the value being the `min-width` pixel width of the element you would like to set the state at.

With the first method, the value of `data-eq-pts` should be each pair and should be separated by a comma `,`.

```html
<div class="component" data-eq-pts="small: 400, medium: 600, large: 900">
  <h1>Hello World</h1>
</div>
```

You can add this attribute via JavaScript if you would like in the following way:

```javascript
var component = document.querySelector('.component');
eqjs.definePts(component, {
  small: 400,
  medium: 600,
  large: 900
});
```

If you use the JavaScript method, you can only pass in a single DOM element at a time. It will return the string for `data-eq-pts` and add the `data-eq-pts` attribute to the element.

Similarly, with the second method, the `eq-pts` mixin is called with a map of your pairs. It is important not to quote your keys in the Sass map, or wonky things may happen in the parsing. At the bottom of your stylesheet, after all of your `eq-pts` have been called, you also need to call the `eq-selectors` mixin in order to write out the hook for **eq.js**.

```scss
.component {
  @include eq-pts((
    small: 400,
    medium: 500,
    large: 700
  ));
}

// ... at the end of the stylesheet

@include eq-selectors;
```

When **eq.js** has determined which state your element is in, it will add an `data-eq-state` attribute to the element set to the human-readable name of the `min-width` specified (along with any other states that have applied thus far). If the element is smaller than the smallest state, there will be no `data-eq-state` attribute. If you did not write your states in order, fear not, they will be sorted for you.

**eq.js** also adds `window.eqjs` to allow you to utilize **eq.js** in your own function calls. It will handle your `DOMContentLoaded` and `load` events as well as all `resize` events, inspecting your DOM to determine what nodes need to be queried each time.

If you dynamically add nodes that you would like to query, you need to trigger **eq.js** yourself. This is easy though! Just load up your nodes into an array or a NodeList and pass that to `eqjs.query(nodes[, cb])`, and **eq.js** will work its magic. `eqjs.query()` also takes a callback as an optional second argument that will be fired once all of the nodes have been processed. It will be passed an array of nodes that were worked on. You can also call `eqjs.all([cb])` to run **eq.js** against all nodes in the DOM (with an optional `cb` callback).

Each node that gets queried will also fire an `eqResize` event once **eq.js** has worked its magic. This'll allow you to code reactively to what happens! The current value of `data-eq-state` will be available in `event.details`;

```javascript
var myElement = document.getElementById('foo');

myElement.addEventListener('eqResize', function (e) {
  console.log('The current Element Query State is `' + e.details + '`');
});
```

Alternatively, you can use `eqjs.refreshNodes()` to update the listing of nodes that is use by `eqjs.query()` with all of the nodes currently in the DOM. This is useful when you know that a node has been dynamically added, but you don't have it as an object and can't pass it to `ejs.query()`.

From there, proceed with styling as normal! Because **eq.js** uses attributes, you're going to want to select using attribute selectors. Styling follows the same patters as normal `min-width` media query styling, with styling for the base first, then subsequent styling added on top:

#### Sass

```scss
.container {
	border: 2px solid red;
	background-color: rgba(red, .25);
	
	&[data-eq-state$="small"],
	&[data-eq-state$="medium"],
	&[data-eq-state$="large"] {
	  font-size: 1em;
	}
	
	&[data-eq-state$="small"] {
	  border-color: green;
	  background-color: rgba(green .25);
	}
	
	&[data-eq-state$="medium"] {
	  border-color: orange;
	  background-color: rgba(orange, .25);
	}
	
	&[data-eq-state$="large"] {
	  border-color: blue;
	  background-color: rgba(blue, .25);
	}
}
```

#### CSS

```css
.container {
  border: 2px solid red;
  background-color: rgba(255, 0, 0, 0.25);
}
.container[data-eq-state$="small"],
.container[data-eq-state$="medium"],
.container[data-eq-state$="large"] {
  font-size: 1em;
}
.container[data-eq-state$="small"] {
  border-color: green;
  background-color: rgba(0, 128, 0, 0.25);
}
.container[data-eq-state$="medium"] {
  border-color: orange;
  background-color: rgba(255, 165, 0, 0.25);
}
.container[data-eq-state$="large"] {
  border-color: blue;
  background-color: rgba(0, 0, 255, 0.25);
}
```

### Bonus!

If you're using [Sass](http://sass-lang.com/), **eq.js** comes with a Sass partial, `_eq.scss`, that provides an `eq` mixin and an `eq-contains` mixin for handling element queries. Import it and use it like you would use a media query mixin, like the one provided by [Breakpoint](https://github.com/team-sass/breakpoint). The mixin will work with Sass 3.4 or greater or Libsass 3.2.0-beta.3 or greater. The above Sass example then becomes something like the following:

```scss
@import "eq";

.container {
	border: 2px solid red;
	background-color: rgba(red, .25);
	
	@include eq('small', 'medium', 'large') {
	  font-size: 1em;
	}
	
	@include eq('small') {
	  border-color: green;
	  background-color: rgba(green .25);
	}
	
	@include eq('medium') {
	  border-color: orange;
	  background-color: rgba(orange, .25);
	}
	
	@include eq('large') {
	  border-color: blue;
	  background-color: rgba(blue, .25);
	}
}
```

The `eq-contains` mixin will allow you to apply styling as long as that state is available in the `data-eq-state` list. Passing in a comma separated list is similar to an `or` media query in that at least one of those states must be active, passing in a space separated list is similar to an `and` media query in that all of the states must be active. Using `eq-contains` will allow styles to be built on top of each other.

If you're compiling with Compass, you're probably going to want to add your bower components directory to your import path to make importing `_eq.scss` easy. To do so, add something like the following to your `config.rb` file:

```ruby
add_import_path "bower_components/eq.js/sass"
```

## Browser Support

**eq.js** uses modern JavaScript, but can [supports older browsers as well](#a-note-on-ie8older-browser-support). It has been tested in the following browsers but is likely to support more:

* IE8+ (see below for notes)
* Firefox 3.5+
* Chrome
* Safari
* Opera 10.0+
* iOS Safari
* Opera Mini
* Android Browser
* Blackberry Browser
* Opera Mobile
* Chrome for Android
* Firefox for Android
* IE Mobile

### A note on IE8/Older Browser Support

There are two files provided: `eq.min.js`, `eq.polyfilled.min.js`, and `polyfills.min.js`. `eq.polyfilled.min.js` includes the polyfills needed to run **eq.js** in older browsers that are missing some newer JavaScript niceties and `polyfills.js` just includes the polyfills. The polyfills that come bundled will work for browsers IE9+. While these allow for a drop-in solutions using just what's provided here, a better solution (and if you need IE8 support, and where a bunch of the polyfills come from), is to consider using something like a [polyfill service](https://github.com/Financial-Times/polyfill-service) for a more robust and well-rounded solution.

The specific polyfills included are as follows:

* [`Object.getPrototypeOf`](http://kangax.github.io/compat-table/es5/#Object.getPrototypeOf)
* [`window.requestAnimationFrame`](http://caniuse.com/#feat=requestanimationframe)
* [`Event.DOMContentLoaded`](http://caniuse.com/#feat=domcontentloaded)
* [`window.getComputedStyle`](http://caniuse.com/#feat=getcomputedstyle)
* [`Array.prototype.forEach`](http://kangax.github.io/compat-table/es5/#Array.prototype.forEach)

## Technical Mumbo Jumbo

**eq.js** has been tested in all modern browsers with thousands of nodes all requesting element queries. The limiting factor performance wise is JavaScript's native `offsetWidth` calculation, which is required for each element; hey, it's an element query after all! We work on reducing read/write layout thrashing by grouping reads separately from writes.

The process for determining which state to apply is primarily greedy for no state, then greedy for the largest state. If the element is neither smaller than its smallest state nor larger than its largest state, it then traverses each state to determine which state is correct. It does this by comparing one state to the next state up, ensuring that the current state is both greater than or equal to the defined `min-width` value and less than the next state's `min-width`.

Performance wise, the script handles itself very well even with thousands of nodes. With this current test setup of around 2.2k nodes, it can parse all of the nodes, calculate the size, and apply the proper attributes in about 35ms. We're employing [requestAnimationFrame](http://www.html5rocks.com/en/tutorials/speed/animations/) to reduce layout thrashing and produce smooth layout and resize. **eq.js** also comes with the full [requestAnimationFrame Polyfill](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/) by Erik Möller and Paul Irish.

Be careful what changes you choose to make with this new found power. While element queries are great in theory, they can cause lots of heartache, especially when combined with inline elements. This script very consciously does not and will not attempt to recalculate element queries on all DOM changes as that is very likely to result in a never-ending rabbit hole of craziness. This, IMO, is one of the biggest things holding back element queries being implemented natively.

### tl;dr

`offsetWidth` is slow, `requestAnimationFrame` reduces layout thrashing, **eq.js** is greedy for natural then largest states, with great power comes great responsibility.
