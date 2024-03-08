import errorCodes from '../constants/error-codes'

class GraphqlError extends Error {
  constructor (error: keyof typeof errorCodes) {
    super(`${error}: ${errorCodes[error]}`)
  }
}

export default GraphqlError
