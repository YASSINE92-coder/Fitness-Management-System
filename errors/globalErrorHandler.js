import AppError from "./AppError.js";

const gloabalErrorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const { message, statusCode, data, type } = err;
    return res.status(statusCode).json({ message, data, type });
  }

  if (process.env.ENV == "development") {
    const message = "error check the console for more details";
    res.status(500).json({ message });
    throw err;
  }
  res.status(500).json({
    message: "something went wrong please try again later!",
  });
};

export default gloabalErrorHandler;
