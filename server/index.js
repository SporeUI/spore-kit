const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const port = 8991;

app.listen(port);

console.info(`server run at 127.0.0.1:${port}`);
