const globalTryCatch = (req, res, next) => {
  try {
    next();
    console.log("here");
  } catch (error) {
    next(error);
  }
};

export default globalTryCatch;
