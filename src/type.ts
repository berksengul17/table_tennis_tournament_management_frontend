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
  pairName: string;
  age: string;
  hotel: string;
};

export type AgeCategory = {
  id: number;
  category: number;
  age: number;
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

export enum AGE_CATEGORY {
  FORTY_TO_FORTY_NINE = "40-49",
  FIFTY_TO_FIFTY_NINE = "50-59",
  SIXTY_TO_SIXTY_FOUR = "60-64",
  SIXTY_FIVE_TO_SIXTY_NINE = "65-69",
  SEVENTY_PLUS = "70+",
}

export type ISeed = {
  id: number;
  // participants: Participant[];
};

export type SeedParticipant = {
  id: number;
  seed: ISeed;
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

export type GLootSeed = {
  id: number;
  name: string;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime?: string;
  state: "NO_SHOW" | "WALK_OVER" | "NO_PARTY" | "DONE" | "SCORE_DONE";
  participants: GLootParticipant[];
};

export type GLootParticipant = {
  id: number;
  resultText: string;
  isWinner: boolean;
  status: "PLAYED" | "NO_SHOW" | "WALK_OVER" | "NO_PARTY" | null;
  name: string;
};
