module.exports = (asyncFn) => {
  return async (req, res, next) => {
    try {
      return await asyncFn(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};
