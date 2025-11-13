export interface AuthenticateUser {
  email: string;
  password: string;
  userName: string;
}

export class AuthenticateUser {
  email!: string;
  password!: string;
  userName!: string;
  constructor(email: string, password: string, userName: string) {
    this.email = email;
    this.password = password;
    this.userName = userName;
  }
}
