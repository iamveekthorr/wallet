interface CookieOptionsDTO {
  expiresIn: Date;
  httpOnly: boolean;
  secure: boolean | undefined;
}

export default CookieOptionsDTO;
