export class HttpError extends Error {
  statusCode: number
  errors?: unknown
  isOperational: boolean

  constructor(statusCode: number, message: string, errors?: unknown, isOperational = true) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = isOperational
  }
}
