# Changelog

## v1.7.0
**March 14, 2015**

* **Change** `data-eq-state` now contains all states that have applied, not just the current state.
* **Change** `eq` mixin now selects using the end attribute selector `[data-eq-state$="#{$state}"]`. [Does not change IE compatibility](http://www.quirksmode.org/css/selectors/#link3)
* **New** `eq-contains` mixin for targeting when a state is available at any size. Selected using the space contained attribute selector `[data-eq-state~="#{$state}"]`.
* **Change** Sass will only compile with Sass 3.4 or greater or Libsass 3.2.0-beta.3 or greater.
