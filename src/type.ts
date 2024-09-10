export type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  city: string;
  rating: number;
  groupId?: number;
  groupRanking?: number;
};

export type ParticipantInputs = Omit<Participant, "id"> & {
  category: string;
  isJoiningDoubles: string;
  pairName: string;
  age: string;
  hotel: string;
};

export type AgeCategory = {
  id: number;
  category: string;
  age: string;
};

export type ParticipantAgeCategoryDTO = {
  id: number;
  pairName: string;
  hotel: string;
} & Omit<Participant, "id"> &
  Omit<AgeCategory, "id">;

export type Option = {
  value: string;
  label: string;
};

export type TableEditedRows = {
  [key: string]: boolean;
};

export type ISeed = {
  id: number;
  // participants: Participant[];
};

export type SeedParticipant = {
  id: number;
  seed: ISeed;
  prevSeed: ISeed;
  participant: Participant;
  pindex: number;
  score: number;
};

export type IRound = {
  id: number;
  seeds: ISeed[];
};

export type IBracket = {
  id: number;
  bracketType: "WINNERS" | "LOSERS";
  ageCategory: AgeCategory;
  rounds: IRound[];
};

export interface Identifiable {
  id: number;
}

export type Admin = {
  id: string;
  name: string;
};

export type Hotel = {
  id: string;
  name: string;
};

export type Group = {
  id: number | null;
  ageCategory: number;
  participants: Participant[];
};

export type Match = {
  id: number;
  group: Group;
  table: Table;
  p1: Participant;
  p2: Participant;
  p1Score: number;
  p2Score: number;
  startTime: string;
  endTime: string;
};

export type GroupTableTime = {
  id: number;
  group: Group;
  tableTime: TableTime;
};

export type TableTime = {
  id: number;
  table: Table;
  time: Time;
  isAvailable: boolean;
};

export type Table = {
  id: number;
  name: string;
};

export type Time = {
  id: number;
  startTime: string;
  endTime: string;
};

export type RoundSeedResponse = {
  roundId: number;
  seedId: number;
  prevSeedId: number;
};
