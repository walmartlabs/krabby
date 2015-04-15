## Authoring krabby tests

#### step 0

all krabby tests should follow the [unix philosophy](http://en.wikipedia.org/wiki/Unix_philosophy), "Do One Thing and Do It Well". It should only be looking at a single source of information (whether that be the filesystem, an API, or otherwise) and processing the data on a single metric. It should be as simple and easy as possible for the end user to use multiple tests to accomplish the "big picture" they are looking for.

#### step 1

all krabby tests should use the [`_baseTest`](https://github.com/patrickkettner/krabby/blob/master/tests/_baseTest.js) as a constructor, passing in any kind of default configuration it wants to have.

```javascript
var krabbyTest = require('krabby/tests/_baseTest');
var defaultConfig = {
  files: ["./foo/**/*.bar"]
}

var fooTest = new krabbyTest(defaultConfig);
```

This gives you an object with the following properties

#### config
_defalult - {}_

`this.config` is the default config that you passed in, that has been (optionally) extended over with the config the end user provided in their `krabby.json`.

#### grade
_default - 1_

`this.grade` should be a float, between `0` and `1` that represents the grade of the code, from the view of your test. `1` is the highest, and `0` being the lowest.

#### logs
_default - { errors: [], warnings: [], logs: [], debug: [] }_

`this.logs` is an object representing various levels of logging, and is the inteded way to communicate stringified data to all krabby `report`ers.

#### step 2

The only requirement after using the `_baseTest` is overwriting the `test` method on your new tests `prototype`.

```javascript
fooTest.prototype.test = function(cb) {
  var self = this;

  this.config.files.forEach(function(file) {
    if (file === "foo") {
      self.config.grade -= 0.01;
    }
  });

  cb(this);
}
```

krabby will give each test a callback, call it with your instance of `_baseTest` (usually just `this` inside of your `prototype.test` function) when completed, then the `report`ers can process the data.
