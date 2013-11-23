/*!
 * restful-wrap - examples/profile.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

exports.show = function (params, callback) {
  setTimeout(function () {
    if (params.empty) {
      return callback();
    }

    if (params.uid === '404') {
      return callback({status: 404, message: 'User ' + params.uid + ' Not Found'});
    }
    callback(null, {name: 'foo', params: params}, {use: 200});
  }, 200);
};

exports.update = function (params, callback) {
  setTimeout(function () {
    if (params.errorObject) {
      return callback(params.errorObject);
    }
    if (params.error) {
      return callback(new Error(params.error));
    }
    callback();
  }, 200);
};
