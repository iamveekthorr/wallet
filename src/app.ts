import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { logger, LoggerOptions } from 'express-winston';
import winston from 'winston';
import RoutesConfig from './routes.config';
import AuthRoutes from './auth/auth.routes';
import AppError from './common/app-error.service';
import ErrorService from './common/error.service';

class App {
  private app: Application;

  // The routes array will keep track of our routes files for debugging purposes
  public routes: Array<RoutesConfig> = [];

  constructor() {
    this.app = express();

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandler();
  }

  public getApp() {
    return this.app;
  }

  private initializeMiddleware(): void {
    this.app.enable('trust proxy');

    this.app.use(cors({ origin: true, credentials: true }));

    const loggerOptions: LoggerOptions = {
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
      ),
    };

    this.app.use(logger(loggerOptions));

    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ limit: '10kb', extended: true }));
  }

  private initializeErrorHandler(): void {
    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });
    this.app.use(new ErrorService().globalErrorHandler);
  }

  private initializeRoutes(): void {
    this.routes.push(new AuthRoutes(this.app));
  }
}

export default new App();
