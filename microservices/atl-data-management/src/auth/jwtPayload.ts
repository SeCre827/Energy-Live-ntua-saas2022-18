export class JwtPayload {
  email: string;
  first_name: string;
  last_name: string;
  licence_expiration: string;
  last_login: string;
  exp: number;
  iat: number;
}

/**
 * {
  "email": "alkouridakis@gmail.com",
  "first_name": "Alexandros",
  "last_name": "Kouridakis",
  "licence_expiration": "2022-05-31T03:43:10Z",
  "last_login": "2022-05-30T03:43:10Z",
  "exp": 1653327234,
  "iat": 1653323634
}
*/
