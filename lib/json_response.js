/*!
 * restful-warp - lib/json_response.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

module.exports = function jsonReponse(body) {
  if (!Buffer.isBuffer(body)) {
    body = new Buffer(JSON.stringify(body));
  }
  // content-type
  this.charset = this.charset || 'utf-8';
  this.setHeader('Content-Type', 'application/json');
  this.setHeader('Content-Length', body.length);
  return this.end(body);
};
