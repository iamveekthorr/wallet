import { Application } from 'express';
import authMiddleware from '../auth-module/middleware/auth.middleware';
import RoutesConfig from '../routes.config';
import userController from './controller/user.controller';

class UserRoutes extends RoutesConfig {
  public app: Application;

  constructor(app: Application) {
    super(app, 'UserRoutes');
    this.app = app;
  }

  public configureRoutes(): Application {
    this.app
      .route('/api/v1/users')
      .get(authMiddleware.protectRoutes, userController.getAllUsers);

    return this.app;
  }
}

export default UserRoutes;
