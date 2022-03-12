import dotenv from 'dotenv';

const config = dotenv.config({ path: '.env.local' });

if (config.error) {
  throw config.error;
}

const envConfig: Record<string, any> = {
  DATABASE: process.env.DATABASE,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

export default envConfig;
