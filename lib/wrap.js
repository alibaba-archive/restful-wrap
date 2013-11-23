/**!
 * restful-wrap - lib/wrap.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var jsonReponse = require('./json_response');

var EMPTY_DATA = {message: 'not found'};

function wrap(fn, auth) {
  return function (req, res, next) {
    if (typeof res.json !== 'function') {
      res.json = jsonReponse;
    }

    var params;
    if (req.method === 'GET') {
      params = req.query || {};
    } else {
      params = req.body || {};
    }
    if (req.params) {
      for (var k in req.params) {
        params[k] = req.params[k];
      }
    }

    var err = auth(params, req.query);
    if (err) {
      return next(err);
    }

    fn(params, function (err, data, extras) {
      if (extras) {
        res.accessLogBackendTime = extras.use || 0;
        res.accessLogHitCache = extras.cache || 0;
      }
      if (err) {
        return next(err);
      }

      if (!data) {
        if (req.method === 'GET') {
          res.statusCode = 404;
          return res.json(EMPTY_DATA);
        } else {
          // no content response
          res.statusCode = 204;
          return res.end();
        }
      }

      res.json(data);
    });
  };
}

/**
 * Create api controller mangaer.
 *
 * api.get('/tests/now', function (params, callback) {
 *   // send success response
 *   callback(null, {params: params, now: new Date()});
 * });
 *
 * @param {Object} app
 * @param {Function(params)} auth request auth function
 * @return {Object} api
 */
module.exports = function (app, auth) {
  var methods = {};
  var names = [];
  for (var method in app) {
    names.push(method);
  }

  names.forEach(function (name) {
    methods[name] = function (urlpattern, handle) {
      if (typeof handle !== 'function') {
        throw new TypeError('app.' + name + '("' + urlpattern + '", ' + handle + ') `handle` should be function');
      }
      // TODO: need to support middleware
      handle = wrap(handle, auth);
      app[name](urlpattern, handle);
    };
  });

  return methods;
};
