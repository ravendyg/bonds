// @ts-check
module.exports = function createFilterParser(filterService) {
  return function(req, res, next) {
    const { hidden } = req.cookies;
    if (hidden && typeof hidden === 'string') {
      filterService.add(hidden);
      res.clearCookie('hidden');
    }
    next();
  };
};
