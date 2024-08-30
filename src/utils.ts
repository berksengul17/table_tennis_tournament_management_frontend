import axios, { AxiosError } from "axios";
import { Participant, ParticipantInputs } from "./type";

export const handleAxiosError = (error: unknown | AxiosError) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  } else {
    console.log("Error", error);
  }
};

export function byField(fieldName: string) {
  return (a: any, b: any) => (a[fieldName] > b[fieldName] ? 1 : -1);
}

export const getName = (participant: Participant) => {
  const names = (participant.firstName + " " + participant.lastName).split(" ");
  return names
    .map((name) => name.slice(0, 1).toUpperCase() + name.slice(1))
    .join(" ");
};

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const participantInputsDefaultValues: Omit<ParticipantInputs, "rating"> =
  {
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    category: "",
    birthDate: "",
    pairName: "",
    age: "",
    city: "",
    hotel: "0",
  };

export const genderOptions = [
  { value: "0", label: "Erkek", categories: ["Erkek", "Karışık"] },
  { value: "1", label: "Kadın", categories: ["Kadın", "Karışık"] },
];
