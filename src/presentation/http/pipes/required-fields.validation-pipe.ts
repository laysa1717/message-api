import {
    ArgumentMetadata,
    BadRequestException,
    NotFoundException,
    ValidationError,
    ValidationPipe,
  } from '@nestjs/common';
  
  export class RequiredFieldsValidationPipe extends ValidationPipe {
    constructor(private readonly requiredFields: string[]) {
      super({
        whitelist: true,
        transform: true,
        forbidUnknownValues: true,
        exceptionFactory: (errors: ValidationError[]) => {
          return new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Payload inválido',
            details: errors.map(e => ({
              property: e.property,
              constraints: e.constraints,
            })),
          });
        },
      });
    }
  
    async transform(value: any, metadata: ArgumentMetadata) {
      const missing = this.requiredFields.filter((f) => !this.hasNonEmpty(value, f));
      if (missing.length > 0) {
        throw new NotFoundException({
          statusCode: 404,
          error: 'Not Found',
          message: `Campo(s) obrigatório(s) ausente(s): ${missing.join(', ')}`,
          missingFields: missing,
        });
      }
  
      return super.transform(value, metadata);
    }
  
    private hasNonEmpty(obj: any, key: string): boolean {
      if (obj == null || typeof obj !== 'object') return false;
      const v = obj[key];
      if (v === undefined || v === null) return false;
      if (typeof v === 'string') return v.trim().length > 0;
      return true;
    }
  }
  