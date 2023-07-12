export type protectedProps = {
  children: React.ReactNode;
};

export type moodsType = {
  icon: string;
  name: string;
  color: string;
};

export type editProps = {
  id: string;
};

export type mainProps = {
  setId: React.Dispatch<React.SetStateAction<string>>;
  setState: React.Dispatch<React.SetStateAction<'Edit' | 'Main'>>;
};
