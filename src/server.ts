import { NextFunction, Request, Response } from 'express';
import debug, { IDebugger } from 'debug';
import envConfig from './util/environment.config';
import app from './app';
import AppError from './common/app-error.service';
import validateEnv from './util/validateEnv';

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const port = envConfig.PORT || 4000;

const debugLog: IDebugger = debug('app');

const server = app
  .getApp()
  .listen(port, () => console.log(`App is running on port ${port}`));

app.getApp().all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

validateEnv();

process.on('unhandledRejection', (reason: any, promise) => {
  debugLog(`Unhandled rejection at ${promise}, reason: ${reason.message}`);
  server.close(() => {
    console.log('closed running process');
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
