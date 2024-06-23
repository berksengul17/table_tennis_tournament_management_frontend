export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  ageCategory: string;
  city: string;
};

export type PlayerInputs = Omit<Player, "id">;
