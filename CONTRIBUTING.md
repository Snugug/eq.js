# Contributing to eq.js

We love contributors! Yes we do! If you would like to contribute to eq.js, please follow the following guidelines:

* **DO NOT ISSUE A PULL REQUEST WITHOUT RELATED ISSUE!!** All pull requests must reference an issue in the issue queue and will only be looked at after discussion about that issue has taken place. Any pull request created that does not reference an issue will be closed.
* Each individual feature you would like add, or bug you would like to squash, should be an individual pull request. Each pull request should be from an individual feature branch to either the latest stable or development branch. **The current *stable* branch is 1.x.x. The current *development* branch is 1.x.x**. Contributions that are not in the form of a pull request will not be considered. If your pull request does not apply cleanly we will ask you to fix that before we will look into pulling it in. We may ask you to update or make changes to the code you've submitted, please don't take this the wrong way. If a pull request smells (such as if a large amount of code is all within a single commit, or the coding standards aren't in line with core `eq.js`) we may ask you to rewrite your commit.
* Follow all coding standards as defined in the current code base. Any code that does not follow the existing coding standards will be asked to be re-written to follow said standards.
* `eq.js` is very specifically *not* a jQuery/Zepto/Other Framework plugin! Any issues opened related to turning this entirely into a jQuery/Zepto/Other Framework plugin or making the core require jQuery/Zepto/Other Framework will not be considered. It's JavaScript people! Just JavaScript!
* We are actively trying to keep `eq.js` as small and as fast as possible. Any PR that significantly increases size or decreases speed will be scrutinized heavily against the benchmark speed of the provided `index.html`.

## Development

Read the damn [Gruntfile][gruntfile]! Either `grunt server` to work on the project, or `grunt build` to build the dist versions.

[gruntfile]: https://github.com/Snugug/eq.js/blob/1.x.x/Gruntfile.js
