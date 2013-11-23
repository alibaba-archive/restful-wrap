/*!
 * restful-wrap - examples/worker.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var web = require('./servers/web');

web.listen(1984);
console.log('[%s] [worker:%d] start, web listen on 1984', Date(), process.pid);
