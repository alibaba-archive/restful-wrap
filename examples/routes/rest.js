/*!
 * restful-wrap - examples/routes.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var restfulWrap = require('../../');
var profile = require('../controllers/profile');
var restAuth = require('../controllers/rest_auth');
var config = require('../config');

function restRoutes(app) {
  var api = restfulWrap(app, restAuth, {
    transformation: true
  });

  /**
   * Profile
   *
   * GET /users/:uid?tags=:tags
   * POST /users/:uid
   */
  api.get('/users/:uid', profile.show);
  api.post('/users/:uid', profile.update);
};

restRoutes.notFound = restfulWrap.notFound();
restRoutes.error = restfulWrap.error(config);

module.exports = restRoutes;
