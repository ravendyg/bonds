const express = require('express');
const fs = require('fs');
const config = require('./config');

const app = express();
const port = 3006;
const dataDir = config.dir + '/data';

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// TODO: implement for corporate
app.get('/styles.css', require('./routes/styles'));
app.use('/', require('./routes/index'));

app.listen(port, () => {
    console.log(`Up on ${port}`);
});
