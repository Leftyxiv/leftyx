import { CustomError } from './customError';

export class DatabaseConnectionError extends CustomError{
  statusCode = 500;
  reason = 'Error connecting to database...'
  constructor(){
    super('db connection issue');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
  serializeErrors(){
    return [
      { message: this.reason }
    ]
  }
}
