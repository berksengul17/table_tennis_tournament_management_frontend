export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  ageCategory: AgeCategory;
  city: string;
  rating: number;
  groupId?: number;
};

export type PlayerInputs = Omit<Player, "id" | "ageCategory"> & {
  ageCategory: string;
};

export type AgeCategory = {
  id: number;
  category: number;
  participants: Player[];
};

export type Group = {
  id: number;
  ageCategory: number;
  participants: Player[];
};

export enum AGE_CATEGORY {
  FORTY_TO_FORTY_NINE = "40-49",
  FIFTY_TO_FIFTY_NINE = "50-59",
  SIXTY_TO_SIXTY_FOUR = "60-64",
  SIXTY_FIVE_TO_SIXTY_NINE = "65-69",
  SEVENTY_PLUS = "70+",
}
