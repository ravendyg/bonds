const request = require('request');

module.exports = function fetch(url) {
    return new Promise(resolve => {
        request({
            url,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                // 'accept-encoding': 'deflate',
                'accept-language': 'en-US,en;q=0.9,ru;q=0.8',
                'cache-control': 'max-age=0',
                'dnt': '1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/71.0.3578.98 Chrome/71.0.3578.98 Safari/537.36',
            },
        }, (err, res) => {
            if (err) {
                console.error(err);
                resolve('');
            } else {
                resolve(res.body);
            }
        });
    });
}
