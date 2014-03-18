/*!
 * restful-wrap - test/wrap.test.js
 *
 * Copyright(c) 2013 - 2014 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var request = require('supertest');
var urlrouter = require('urlrouter');
var restfulWrap = require('../');
var app = require('../examples/servers/web');

describe('wrap.test.js', function () {
  before(function (done) {
    app.listen(0, done);
  });

  it('should throw error when arguments.length < 2', function () {
    (function () {
      urlrouter(function (app) {
        var api = restfulWrap(app);
        api.get('/foo');
      });
    }).should.throw('app.get need more than one argument');
  });

  it('should throw error when handle is not function', function () {
    (function () {
      urlrouter(function (app) {
        var api = restfulWrap(app);
        api.get('/foo', {});
      });
    }).should.throw('app.get("/foo", [object Object]) `handle` should be function');
  });

  it('should handle without auth function ok', function () {
    urlrouter(function (app) {
      var api = restfulWrap(app);
      api.get('/foo', function () {});
    });
  });

  it('should get / status 200', function (done) {
    request(app)
    .get('/')
    .expect('Content-Type', 'text/html')
    .expect('hello world')
    .expect(200, done);
  });

  it('should get /v1/ status 404', function (done) {
    request(app)
    .get('/v1/')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({"message": "GET /v1/ Not Found"})
    .expect(404, done);
  });

  it('should get /v1/foo status 404', function (done) {
    request(app)
    .get('/v1/foo')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({"message": "GET /v1/foo Not Found"})
    .expect(404, done);
  });

  it('should get /v1/users/1 without token status 403', function (done) {
    request(app)
    .get('/v1/users/1')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({"message": "token forbidden"})
    .expect(403, done);
  });

  it('should get /v1/users/1?token=dev status 200', function (done) {
    request(app)
    .get('/v1/users/1?token=dev')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({name: 'foo', params: {token: 'dev', uid: '1'}})
    .expect(200, done);
  });

  it('should get /v1/users/404?token=dev status 404', function (done) {
    request(app)
    .get('/v1/users/404?token=dev')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({"message": "User 404 Not Found"})
    .expect(404, done);
  });

  it('should get /v1/users/404?token=dev&empty=1 status 404', function (done) {
    request(app)
    .get('/v1/users/404?token=dev&empty=1')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({"message": "not found"})
    .expect(404, done);
  });

  it('should post /v1/users/1 status 204', function (done) {
    request(app)
    .post('/v1/users/1')
    .send({token: 'dev', age: 100})
    .expect('')
    .expect(204, done);
  });

  it('should post /v1/users/1 status 403 with wrong token', function (done) {
    request(app)
    .post('/v1/users/1')
    .send({token: 'devworng', age: 100})
    .expect({"message": "token forbidden"})
    .expect(403, done);
  });

  it('should post /v1/users/1 status 500 mock server error', function (done) {
    request(app)
    .post('/v1/users/1')
    .send({token: 'dev', error: 'mock error'})
    .expect({"message": "mock error"})
    .expect(500, done);
  });

  it('should post /v1/users/1 status 500 mock server errorObject', function (done) {
    require('../examples/config').debug = false;

    request(app)
    .post('/v1/users/1')
    .send({
      token: 'dev',
      errorObject: {body: 'body', message: 'mock error', errors: [{name: 'MockError'}], params: {foo: 'bar'}}
    })
    .expect({
      message: 'Server Error',
      body: 'body',
      errors: [{name: 'MockError'}],
      params: {foo: 'bar'}
    })
    .expect(500, done);
  });

  it('should middlewares work ok', function (done) {
    request(app)
    .get('/v1/mirror?token=dev')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({
      token: 'dev',
      foo: 'bar',
      hello: 'world'
    })
    .expect(200, done);
  });
});
