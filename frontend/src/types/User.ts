export type loginDetailsType = {
  email: string;
  password: string;
};

export interface signupDetailsType extends loginDetailsType {
  username: string;
  gender: string;
}

export type rank = {
  top3: ranktype[] | [];
  others: ranktype[] | [];
};

type ranktype = {
  name: string;
  points: number;
};

export type profile = {
  username: string | null;
  gender: 'male' | 'female' | 'others';
  email: string | null;
  gamification: {
    points: number;
    streak: number;
  } | null;
};
