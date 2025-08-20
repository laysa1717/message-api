export class DomainError extends Error {
    public readonly details?: Record<string, any>;
  
    constructor(message: string, details?: Record<string, any>) {
      super(message);
      this.name = 'DomainError';
      this.details = details;
    }
  }
  
  export class AlreadyExistsError extends DomainError {
    constructor(message: string, details?: Record<string, any>) {
      super(message, details);
      this.name = 'AlreadyExistsError';
    }
  }
  