## Authoring krabby reports

all krabby reports should follow the [unix philosophy](http://en.wikipedia.org/wiki/Unix_philosophy), "Do One Thing and Do It Well". It should only be looking at a single source of information (whether that be the filesystem, an API, or otherwise) and processing the data on a single metric. It should be as simple and easy as possible for the end user to use multiple reports to accomplish the "big picture" they are looking for.

#### getting going

Each report is a function that is given two arguments, `results`, and `callback`.

`results` is array of JSON objects containing the results from each test run. You will want to iterate result to process it. You can read more about the object signature of each test [here](https://github.com/patrickkettner/krabby/tree/master/tests).
`callback` is just a way to message that you have completed whatever processing you are doing. It does not need to be called with any arguments.
