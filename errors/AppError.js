class AppError extends Error {
  constructor(message, statusCode = 404, data = null, type = "app") {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.type = type;
  }
  static validate(req) {}
}

export default AppError;
