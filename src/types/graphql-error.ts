import errorCodes from '../constants/error-codes'

class GraphqlError extends Error {
  constructor (error: keyof typeof errorCodes, message?: string) {
    super(`${error}: ${message ?? errorCodes[error]}`)
  }
}

export default GraphqlError
