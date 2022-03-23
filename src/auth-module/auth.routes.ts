import { Application } from 'express';

import RoutesConfig from '../routes.config';
import AuthController from './controller/auth.controller';
import ValidateSignInBody from './middleware/validate-signin.middleware';
import ValidateSignUpBody from './middleware/validate-signup.middleware';
import VerifyJWTExpired from './middleware/verifyJWTExpired.middleware';

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
      .post(ValidateSignInBody.validateSignIn, AuthController.signIn);

    this.app
      .route('/api/v1/auth/signup')
      .post(ValidateSignUpBody.validateSignUp, AuthController.signUp);

    this.app.route('/api/v1/auth/logout').get(AuthController.signOut);

    this.app.get(
      '/api/v1/auth/check-session',
      VerifyJWTExpired.checkJWTExpired
    );

    return this.app;
  }
}

export default AuthRoutes;
