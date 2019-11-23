const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const config = require('./config');

const app = express();
app.use(cookieParser());
const dataDir = config.dir + '/data';

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

app.get('/styles.css', require('./routes/styles'));
app.get('/my-styles.css', require('./routes/my-styles'));
app.get('/script.js', require('./routes/script'));
app.use('/', require('./routes/index'));

app.listen(config.port, () => {
    console.log(`Up on ${config.port}`);
});
