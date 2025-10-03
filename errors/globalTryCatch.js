const globalTryCatch = (req, res, next) => {
  try {
    next();
  } catch (error) {
    next(error);
  }
};

export default globalTryCatch;
