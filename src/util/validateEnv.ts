import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET_KEY: str(),
    DATABASE_PASSWORD: str(),
    NODE_ENV: str(),
    DATABASE: str(),
    PORT: port(),
  });
}

export default validateEnv;
