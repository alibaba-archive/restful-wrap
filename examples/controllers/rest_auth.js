/**!
 * restful-wrap - examples/controllers/rest_auth.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

module.exports = function auth(params, query) {
  if (params.token !== 'dev') {
    return {
      status: 403,
      message: 'token forbidden'
    };
  }
};
