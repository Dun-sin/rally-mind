export type loginDetailsType = {
  email: string;
  password: string;
};

export interface signupDetailsType extends loginDetailsType {
  username: string;
}
