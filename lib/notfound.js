/**!
 * restful-wrap - lib/notfound.js
 *
 * Copyright(c) 2013 - 2014 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var jsonReponse = require('./json_response');

module.exports = function (options) {
  return function notfound(req, res, next) {
    if (typeof res.json !== 'function') {
      res.json = jsonReponse;
    }

    var url = req.originalUrl || req.url;
    res.statusCode = 404;
    res.json({
      message: req.method + ' ' + url + ' Not Found'
    });
  };
};
