import { Application } from 'express';
import RoutesConfig from '../routes.config';
import AuthController from './auth.controller';
import AuthMiddleware from './middleware/auth.middleware';

class AuthRoutes extends RoutesConfig {
  constructor(app: Application) {
    super(app, 'AuthRoutes');
    this.app = app;
  }

  // implement the abstract method keep
  public configureRoutes(): Application {
    this.app
      .route('/api/v1/auth/login')
      .post(AuthMiddleware.validateSignIn, AuthController.signIn);

    this.app
      .route('/api/v1/auth/signup')
      .post(AuthMiddleware.validateSignUp, AuthController.signUp);

    return this.app;
  }
}

export default AuthRoutes;
