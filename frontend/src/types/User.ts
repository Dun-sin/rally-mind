export type loginDetailsType = {
  email: string;
  password: string;
};

export interface signupDetailsType extends loginDetailsType {
  username: string;
}

export type rank = {
  top3: ranktype[] | [];
  others: ranktype[] | [];
};

type ranktype = {
  name: string;
  points: number;
};
