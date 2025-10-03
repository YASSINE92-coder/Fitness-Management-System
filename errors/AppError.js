class AppError extends Error {
  constructor(message, statusCode = 404, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default AppError;
