## krabby
a code conformance module runner.

![edna](https://cloud.githubusercontent.com/assets/465414/7166524/3ceb63e2-e37c-11e4-8bde-528c6284e062.png)

### what?
krabby is an extremely unopinionated module runner, similar to [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/), but rather than helping create your build, it grades it based on tests and rules that you define.

You pick and choose the tests that you want to use to test your code, and another set of tests you use to grade the results. This gives you the ability to check your code's quality from the biggest of pictures down to the finest of detail.

## why?
When working with teams larger than just yourself, it is common for a number of different styles to emerge. Code that is totally fine with one person, may be completely unacceptable to another. As a result, it becomes harder and harder to be able to trust code that you yourself didn't write. This is where krabby shines! By creating your own `krabby.json` file, you can quickly get a detailed report on whether or not any piece of code is up to your standards.

## how?
Before anything else, you will need to install krabby.

```
npm install -g krabby
```

Next, you will need to create your configuration. This is just a simple JSON object representing the tests and reports that you wish to have run.

```json
{
  "krabby": {
    "tests": [ "jshint" ],
    "reports": [ "badge" ]
  }
}
```

The only fields that are required are `tests` and `reports`. Each take an array of either strings or objects. When it is a string, it means it will run the test by that name with it's default settings. If you wish to override the default settings (which you almost always should...), you just use an object instead.

```json
{
  "krabby": {
    "tests": [ {
      "name": "jshint",
      "files": ["./**/*.js", "!./node_module"],
      "testConfig": {
        "browser": true
      }
    } ],
    "reports": [ "badge" ]
  }
}
```

The only difference being you need to pass the name of the test in the `name` key. Each test can take different option (some don't operate on files, so they have no use for a `files` parameter, for example), but all tests should conform to the following basics

#### name - _required_
The only thing that is actually _required_, the `name` parameter represents the file name of each test. This means either the files listed in the included [tests directory](https://github.com/patrickkettner/krabby/tree/master/tests), or any module installed with a `krabby-` prefix (e.g. `jshint` means either the file in `tests/jshint.js` or an external module named `krabby-jshint`).

#### files
`files` is an array of strings. They can be [globs](http://en.wikipedia.org/wiki/Glob_%28programming%29) (`["./**/*.js"]`), or just regular paths pointing to specific files (`["./index.js"]`).

#### testConfig
`testConfig` can be any data format (string, array, object, etc) but is almost always an object. It is the canonical way to pass configuration from your krabby configuration to an underlying library (e.g. the [jshint task](https://github.com/patrickkettner/krabby/blob/master/tests/jshint.js) passes this to the [jshint library](http://jshint.com/docs/))



Since krabby tries to be as flexible as possible, you can place this configuration in a number of locations.

#### package.json
npm [encourages you](http://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging) to package.json all the things. Therefore you can place your config inside a `package.json` file, and as long as krabby is ran from within the same project (meaning the folder the package.json file is in, or one of its child folders) krabby will automatically find and parse it.

#### krabby.json
if you don't want to add a new field to your package.json for some reason, you can also create a new files called `krabby.json` The same run-in-the-same-project rules from the `pacakge.json` apply here, too.

#### --config
`krabby` the command takes a `--config | -c` argument that lets you pass a filepath to a configuration file. This lets you maintain your own preferred `krabby.json` file that you can quickly and easily use to compare against any new code you come across.
