import { Application } from 'express';

import RoutesConfig from '../routes.config';
import ProtectRoutes from '../middleware/protect.middleware';
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
      .get(ProtectRoutes.protectRoutes, userController.getAllUsers);

    return this.app;
  }
}

export default UserRoutes;
