export interface IUser {
  username: string;
  password: string;
  _id?: string;
}

export interface IAuthResponse {
  token: string;
}
