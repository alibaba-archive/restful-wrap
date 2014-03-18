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

function wrap(fn, auth, options) {
  if (typeof auth !== 'function') {
    options = auth || {};
    auth = options.auth || function () {};
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
    if (options.inputTransformer) {
      params = options.inputTransformer(params);
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
      if (options.outputTransformer) {
        data = options.outputTransformer(data);
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
 *   - {Function} inputTransformer  function to transform input var style
 *   - {Function} outputTransformer function to transform output var style
 *   - {Function} auth              auth request auth function
 * @return {Object} api
 */
module.exports = function (app, auth, options) {
  var methods = {};
  var names = [];
  for (var method in app) {
    names.push(method);
  }

  names.forEach(function (name) {
    methods[name] = function (urlpattern) {
      if (arguments.length < 2) {
        throw new TypeError('app.' + name + ' need more than one argument');
      }

      var middlewares = Array.prototype.slice.call(arguments);
      var handle = middlewares.pop();

      if (typeof handle !== 'function') {
        throw new TypeError('app.' + name + '("' + urlpattern + '", ' + handle + ') `handle` should be function');
      }

      handle = wrap(handle, auth, options);
      middlewares.push(handle);
      app[name].apply(app, middlewares);
    };
  });

  return methods;
};
