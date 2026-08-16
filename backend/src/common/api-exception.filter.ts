import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ApiError } from "./api-error";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ApiError) {
      response.status(exception.status).json({
        error: {
          code: exception.code,
          message: exception.message
        }
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      const message = typeof raw === "string" ? raw : (raw as { message?: string | string[] }).message;
      response.status(status).json({
        error: {
          code: status === HttpStatus.UNAUTHORIZED ? "UNAUTHENTICATED" : "VALIDATION_ERROR",
          message: Array.isArray(message) ? message[0] : message ?? exception.message
        }
      });
      return;
    }

    response.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again."
      }
    });
  }
}
