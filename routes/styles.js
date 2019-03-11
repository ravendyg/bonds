const fs = require('fs');
const fetch = require('../services/fetch');
const config = require('../config');

const cssFile = config.dir + '/data/styles.css';

module.exports = async function styles(req, res) {
    let str = '';
    if (!fs.existsSync(cssFile)) {
        str = await fetch('https://smart-lab.ru/plugins/trade/templates/skin/default/actions/ActionQ/css/styles.css');
        fs.writeFileSync(cssFile, str);
    } else {
        str = fs.readFileSync(cssFile);
    }

    res.send(str);
}
