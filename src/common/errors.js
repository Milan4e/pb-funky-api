class ApiError extends Error {
  constructor (type, message, status) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.type = type
    this.status = status
  }
}

module.exports = {
  ApiError,
}
