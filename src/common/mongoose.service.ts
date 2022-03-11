import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

class MongooseService {
  private DB = process.env.DATABASE!;

  private replacePassword(connection: string): string {
    return connection.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);
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
