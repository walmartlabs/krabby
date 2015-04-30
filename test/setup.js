/**
 * Test setup for server-side tests.
 */

// Add test globals
global.assert = require('assert');
global.sinon = require('sinon');

// Set test environment
process.env.NODE_ENV = "test";
