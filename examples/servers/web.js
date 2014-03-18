/*!
 * restful-wrap - examples/servers/web.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var connect = require('connect');
var urlrouter = require('urlrouter');
var restRoutes = require('../routes/rest');

var app = connect();
app.use(connect.query());
app.use(connect.bodyParser());

var API_BASE_URL = '/v1';
app.use(API_BASE_URL, urlrouter(restRoutes));
app.use(API_BASE_URL, restRoutes.notFound);
app.use(API_BASE_URL, restRoutes.error);

app.use('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end('hello world');
});

if (!module.parent) {
  app.listen(7001);
  console.log('web server start listen at 7001');
}
module.exports = app;
