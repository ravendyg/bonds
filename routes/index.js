const express = require('express');
const fs = require('fs');
const fetch = require('../services/fetch');
const parse = require('../services/parseBonds');
const config = require('../config');
const toHtml = require('../services/toHtml');
const { consts } = require('../consts');

const dataDir = config.dir + '/data';
const allowedTypes = ['ofz', 'subfed', 'bonds'];

const router = express.Router();

const nanRegexp = /^[0-9.]{1,}$/;

function compare(a1, a2) {
    if (typeof a1 === 'string' && nanRegexp.test(a1)) {
        // try as numbers first
        const b1 = parseFloat(a1);
        const b2 = parseFloat(a2);
        if (!isNaN(b1) && !isNaN(b2)) {
            return b2 > b1
                ? 1
                : b2 < b1
                    ? -1
                    : 0;
        }
    }

    return a2 > a1
        ? 1
        : a2 < a1
            ? -1
            : 0;
}

router.get('/', async (req, res) => {
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length === 0 ||
        queryKeys.length === 1 && queryKeys[0] === 'type'
    ) {
        const type = req.query.type || 'bonds';
        return res.redirect(`/?type=${type}&sort=5&upperLimit=20&lowerLimit=0&order=desc`);
    }

    const {
        type = 'bonds',
        // column to sort by
        sort,
        order = 'desc',
        upperLimit,
        lowerLimit,
    } = req.query;
    let index = parseInt(sort) || 5;
    let _upperLimit = upperLimit;
    let _lowerLimit = lowerLimit;
    // default upper limit for returns without reinvestment
    if (typeof _upperLimit === 'undefined' && index === 5) {
        _upperLimit = consts.withoutReinvestmentDefaultUpperLimit;
    }
    if (typeof _lowerLimit === 'undefined' && index === 5) {
        _lowerLimit = consts.withoutReinvestmentDefaultLowerLimit;
    }
    if (allowedTypes.indexOf(type) === -1) {
        res.statusCode = 400;
        return res.send('unsupported type');
    }

    const bondsFileStr = `${dataDir}/${type}.txt`;
    let data;
    let str = '';
    const url = `https://smart-lab.ru/q/${type}/`;

    try {
        const { mtime } = fs.lstatSync(bondsFileStr);
        if (Date.now() - mtime > 1000 * 60 * 60) {
            str = await fetch(url);
            fs.writeFileSync(bondsFileStr, str);
        } else {
            str = fs.readFileSync(bondsFileStr);
        }
    } catch (err2) {
        str = await fetch(url);
        fs.writeFileSync(bondsFileStr, str);
    }
    if (!str) {
        res.statusCode = 404;
        return res.send('not found');
    }

    try {
        data = parse(str, type);
        const mult = order === 'asc' ? -1 : 1;
        data.sort((e1, e2) => {
            return compare(e1[index], e2[index]) * mult;
        });
        if (typeof _upperLimit !== 'undefined' || typeof _lowerLimit !== 'undefined') {
            data = data.filter(e => {
                return (_upperLimit === undefined || e[index] < _upperLimit)
                && (_lowerLimit === undefined || e[index] > _lowerLimit)
            }
            );
        }
    } catch (err) {
        console.error(err);
        res.sendStatus = 500;
        return res.send('server error');
    }
    let sortDirection = ['asc', 'desc'].indexOf(order) !== -1 ? order : 'desc';

    res.send(toHtml(data, type, index, sortDirection));
});

module.exports = router;
