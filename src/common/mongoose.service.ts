import mongoose from 'mongoose';
import envConfig from '../util/environment.config';

class MongooseService {
  private DB = envConfig.DATABASE!;

  private replacePassword(connection: string): string {
    return connection.replace('<PASSWORD>', envConfig.DATABASE_PASSWORD!);
  }

  constructor() {
    this.connect();
  }

  private connect(): void {
    const connection = this.replacePassword(this.DB);

    mongoose
      .connect(connection)
      .then(() => console.log('connected'))
      .catch((err) => {
        console.log(err);
      });
  }

  public getMongoose() {
    return mongoose;
  }
}

export default new MongooseService();
