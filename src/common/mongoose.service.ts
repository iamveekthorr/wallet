import debug from 'debug';
import mongoose from 'mongoose';
import envConfig from '../util/environment.config';

const log: debug.IDebugger = debug('app:mongoose-service');
class MongooseService {
  private DB = envConfig.DATABASE!;

  constructor() {
    this.connect();
  }

  private replacePassword(connection: string): string {
    return connection.replace('<PASSWORD>', envConfig.DATABASE_PASSWORD!);
  }

  private connect(): void {
    const connection = this.replacePassword(this.DB);

    mongoose
      .connect(connection)
      .then(() => log('connected'))
      .catch((err) => {
        log(err);
      });
  }

  public getMongoose() {
    return mongoose;
  }
}

export default new MongooseService();
