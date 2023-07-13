export type protectedProps = {
  children: React.ReactNode;
};

export type moodsType = {
  icon: string;
  name: string;
  color: string;
};

export type editProps = {
  journalInfo: journalProps;
  setState: React.Dispatch<React.SetStateAction<'Edit' | 'Main'>>;
};

export type mainProps = {
  setJournalInfo: React.Dispatch<React.SetStateAction<journalProps>>;
  setState: React.Dispatch<React.SetStateAction<'Edit' | 'Main'>>;
};

export type journalProps = {
  date: string;
  message: string;
  _id: string;
};
