import { Application } from 'express';
import RoutesConfig from '../routes.config';
import AuthController from './controller/auth.controller';
import AuthMiddleware from './middleware/auth.middleware';

class AuthRoutes extends RoutesConfig {
  public app: Application;

  constructor(app: Application) {
    super(app, 'AuthRoutes');
    this.app = app;
  }

  // implement the abstract method
  public configureRoutes(): Application {
    this.app
      .route('/api/v1/auth/login')
      .post(AuthMiddleware.validateSignIn, AuthController.signIn);

    this.app
      .route('/api/v1/auth/signup')
      .post(AuthMiddleware.validateSignUp, AuthController.signUp);

    this.app.route('/api/v1/auth/logout').get(AuthController.signOut);

    this.app.get('/api/v1/auth/check-session', AuthMiddleware.checkJWTExpired);

    return this.app;
  }
}

export default AuthRoutes;
