#!/usr/bin/env node

var yargs = require('yargs');
var krabby = require('..');
var path = require('path');
var _ = require('lodash');

var argv = yargs
  .alias('c', 'config')
  .argv;

krabby(_.isUndefined(argv.config) ? {} : require(path.resolve(argv.config)));
