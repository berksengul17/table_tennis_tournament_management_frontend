import axios, { AxiosError } from "axios";
import { ParticipantAgeCategoryDTO } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = "http://localhost:8082/api/participant-age-category";

export const getParticipants = async (
  categoryVal?: number,
  ageVal?: number
): Promise<ParticipantAgeCategoryDTO[]> => {
  try {
    const response = await axios.get(`${API_URL}/get-participants`, {
      params: { categoryVal, ageVal },
    });
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const updateParticipant = async (
  participantAgeCategoryDTO: ParticipantAgeCategoryDTO
): Promise<string> => {
  try {
    const response = await axios.put(
      `${API_URL}/update-participant/${participantAgeCategoryDTO.id}`,
      participantAgeCategoryDTO
    );
    return response.data;
  } catch (error: AxiosError | unknown) {
    handleAxiosError(error);
  }

  return "";
};
