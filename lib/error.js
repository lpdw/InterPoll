function APIError(status, message = 'Default Message') {
 this.name = 'APIError';
 this.message = message;
 this.status = status;
  }
APIError.prototype = Object.create(Error.prototype);
APIError.prototype.constructor = APIError;
module.exports = APIError;
