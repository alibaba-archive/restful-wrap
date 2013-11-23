/**!
 * restful-wrap - lib/error.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var jsonReponse = require('./json_response');

module.exports = function restfulErrorWrap(options) {
  options = options || {};
  options.logger = options.logger || console;
  options.debug = !!options.debug;

  return function restfulErrorHandler(err, req, res, next) {
    if (typeof res.json !== 'function') {
      res.json = jsonReponse;
    }

    var status = err.status || 500;
    var result = {
      message: err.message
    };

    // Don't show error stack on prodution env
    if (status >= 500 && !options.debug) {
      result.message = 'Server Error';
    }

    if (err.errors) {
      result.errors = err.errors;
    }

    if (err.params) {
      result.params = err.params;
    }

    if (err.body) {
      result.body = err.body;
    }

    if (status === 400) {
      // json parse error by connect/json middleware.
      if (result.message === 'invalid json') {
        result.message = 'Body should be a JSON Hash';
      } else if (err.name === 'SyntaxError') {
        result.message = 'Problems parsing JSON: ' + result.message;
      }
    }

    res.statusCode = status;
    res.json(result);

    // logger error
    if (status >= 500) {
      if (!err.data) {
        err.data = {params: err.params};
      }
      if (!err.url) {
        var url = req.originalUrl || req.url;
        err.url = url;
      }
      options.logger.error(err);
    }
  };
};
