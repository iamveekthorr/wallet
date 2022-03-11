import { Application } from 'express';

abstract class RoutesConfig {
  public app: Application;

  private routeName: string;

  constructor(app: Application, routeName: string) {
    this.app = app;
    this.routeName = routeName;
    this.configureRoutes();
  }

  public getRouteName(): string {
    return this.routeName;
  }

  public abstract configureRoutes(): Application;
}

export default RoutesConfig;
