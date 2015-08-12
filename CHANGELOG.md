# Changelog

## v1.7.1
**August 12, 2015**
* **Fix** Polyfills work when polyfill has an `&&` ([#53](https://github.com/Snugug/eq.js/issues/53))
* **Fix** `eqResize` event now bubbles ([#52](https://github.com/Snugug/eq.js/issues/52))

## v1.7.0
**July 30, 2015**
* **New**  An `eqResize` will fire whenever an object gets resized! Yay!
* **Change** IE8 support dropped from polyfills due to complexity of support for custom events. Use the [Financial Times polyfill service](https://github.com/Financial-Times/polyfill-service) (or similar) for well-rounded fallback support

**March 14, 2015**

* **Change** `data-eq-state` now contains all states that have applied, not just the current state.
* **Change** `eq` mixin now selects using the end attribute selector `[data-eq-state$="#{$state}"]`. [Does not change IE compatibility](http://www.quirksmode.org/css/selectors/#link3)
* **New** `eq-contains` mixin for targeting when a state is available at any size. Selected using the space contained attribute selector `[data-eq-state~="#{$state}"]`.
* **Change** Sass will only compile with Sass 3.4 or greater or Libsass 3.2.0-beta.3 or greater.
