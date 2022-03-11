/* eslint-disable no-param-reassign */
import { NextFunction, Request, Response } from 'express';
import AppError from './app-error.service';

class ErrorService {
  private handleJWTError: () => AppError = (): AppError =>
    new AppError('Invalid token please try again', 401);

  private handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}.`;

    return new AppError(message, 400);
  };

  private handleJWTExpiredError = (): AppError =>
    new AppError('Your token has expired. Please login again', 401);

  private handleDuplicateFieldsDB = (err: any): AppError => {
    const message = `${Object.keys(err.keyValue)[0]}: ${
      Object.values(err.keyValue)[0]
    } already exists. Please use a different ${Object.keys(err.keyValue)[0]}`;

    return new AppError(message, 409);
  };

  private handleValidationErrorDB = (err: any): AppError => {
    const errors = Object.values(err.errors).map((el: any) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;

    return new AppError(message, 400);
  };

  private sendErrorDev = (err: AppError, req: Request, res: Response): void => {
    console.log(req.originalUrl);
    console.log(err);
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

    console.error(`[errorController.js] (line 45) - ${err.message}`);
  };

  private sendErrorProd = (
    err: AppError,
    req: Request,
    res: Response
  ): void => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      return;
    }

    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error(`[errorController.js] (line 61) - ${err.message}`);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  };

  public globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    _next: NextFunction
  ): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
      this.sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };

      error.message = err.message;

      if (error.name === 'JsonWebTokenError') error = this.handleJWTError();
      if (error.name === 'CastError') error = this.handleCastErrorDB(error);
      if (error.code === 11000) error = this.handleDuplicateFieldsDB(error);
      if (error.message.includes('validation failed')) {
        error = this.handleValidationErrorDB(error);
      }

      if (error.name === 'TokenExpiredError') {
        error = this.handleJWTExpiredError();
      }

      this.sendErrorProd(error, req, res);
    }
  };
}

export default ErrorService;
