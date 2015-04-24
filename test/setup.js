/**
 * Test setup for server-side tests.
 */

// Add test globals
global.assert = require('assert');

// Set test environment
process.env.NODE_ENV = "test";
