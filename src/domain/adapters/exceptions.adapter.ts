export interface ExceptionParams {
  message: string;
}

export abstract class ExceptionsAdapter {
  abstract badRequest(data: ExceptionParams): void;
  abstract internalServerError(data?: ExceptionParams): void;
  abstract forbidden(data?: ExceptionParams): void;
  abstract unauthorized(data?: ExceptionParams): void;
  abstract notFound(data?: ExceptionParams): void;
  abstract wrongCredentials(): void;
}
