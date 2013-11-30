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
var transformer = require('var-style');

var EMPTY_DATA = {message: 'not found'};

function wrap(fn, auth, options) {
  if (typeof auth !== 'function') {
    options = auth;
    auth = function () {};
  }
  options = options || {};
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
    if (options.transformation) {
      params = transformer.snakeToCamel(params);
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
      if (options.transformation) {
        data = transformer.camelToSnake(data);
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
 * @param {Object} options
 *   - {Boolean} tranformation  need tranform params between snake style and camel style
 * @return {Object} api
 */
module.exports = function (app, auth, options) {
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
      handle = wrap(handle, auth, options);
      app[name](urlpattern, handle);
    };
  });

  return methods;
};
