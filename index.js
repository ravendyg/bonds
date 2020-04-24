// @ts-check
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const config = require('./config');
const createFilterService = require('./services/filter');
const createFilterParser = require('./midlewares/filterParser');
const createIndexRouter = require('./routes/index');

const app = express();
// @ts-ignore
app.use(cookieParser());

const { dataDir } = config;
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const filterService = createFilterService(fs, config);
const filterParser = createFilterParser(filterService);

const indexRouter = createIndexRouter(filterService);

app.get('/styles.css', require('./routes/styles'));
app.get('/my-styles.css', require('./routes/my-styles'));
app.get('/script.js', require('./routes/script'));
app.get('/', filterParser, indexRouter);

app.listen(config.port, () => {
    console.log(`Up on ${config.port}`);
});
