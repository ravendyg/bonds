const express = require('express');
const fs = require('fs');
const config = require('./config');

const app = express();
const dataDir = config.dir + '/data';

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

app.get('/styles.css', require('./routes/styles'));
app.use('/', require('./routes/index'));

app.listen(config.port, () => {
    console.log(`Up on ${config.port}`);
});
