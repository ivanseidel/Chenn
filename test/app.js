/*
 * Module dependencies.
 */

var request = require('supertest')
var should = require('should')
var app = require('../wisepix.server')

before(function (done) {
	// Wait Server to Lift
	app(done);
})

describe('Users', function () {
	describe('POST /users', function () {
		it('should create a user', function (done) {
			// fill the test
			done()
		})
	});

	describe('GET /users', function () {
		it('should get a user', function (done) {
			// fill the test
			done()
		})
	});
})

after(function (done) {
	// do some stuff
	done()
})