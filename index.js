'use strict';
const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const wrapPunyware = require('./punyware-adapter-koa');
const endpoint = require('./twitter-oauth.punyware');

const app = new Koa();
const router = new Router();

router.get('/auth/:strategy', bodyParser(), wrapPunyware(endpoint));

app.use(router);

app.listen(3030);
