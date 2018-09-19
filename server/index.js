const $path = require('path');
const $express = require('express');
const $jestPuppeteerConfig = require('../jest-puppeteer.config');

const app = $express();
app.use($express.static($path.join(__dirname, '../')));
app.listen($jestPuppeteerConfig.server.port);
