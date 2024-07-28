import axios, { AxiosError } from "axios";
import { ParticipantAgeCategoryDTO } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = "http://localhost:8081/api/participant-age-category";

export const getParticipants = async (): Promise<
  ParticipantAgeCategoryDTO[]
> => {
  try {
    const response = await axios.get(`${API_URL}/get-participants`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};
