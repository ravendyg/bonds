const fs = require('fs');
const path = require('path');

const scriptBody = fs.readFileSync(path.join(__dirname, '..', 'script.js'));
module.exports = async function script(req, res) {
  res.send(scriptBody);
}
