module.exports = async function styles(req, res) {
  res.setHeader('Content-Type', 'text/css');
  res.send(`
    .hide {
      cursor: pointer;
    }
  `);
};
