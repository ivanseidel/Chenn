/*
 * Module dependencies.
 */

var request = require('supertest')
var should = require('should')
var server = require('../wisepix.server')

before(function (done) {
	// Wait Server to Lift
	server(done);
})

describe('Queue > ', function () {
	describe('Queuer', function () {

		it('should queue a work', function (done) {
			app.controllers.Queue.queue('Queue.ping', {Test: 'Payload', shouldBe: true}, done);
		});

		it('should resolve to a method in controller', function (done){

			app.controllers.Queue.test = function (payload, next){
				should(payload).have.property('Test');

				next();
			};

			app.controllers.Queue.run('Queue.test', {Test: 'Payload'}, done);

		});

	});
})

after(function (done) {
	// do some stuff
	done()
})