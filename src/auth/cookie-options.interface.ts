interface CookieOptions {
  expiresIn: Date;
  httpOnly: boolean;
  secure: boolean | undefined;
}

export default CookieOptions;
