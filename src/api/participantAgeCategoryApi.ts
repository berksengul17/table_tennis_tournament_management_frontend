import axios, { AxiosError } from "axios";
import { ParticipantAgeCategoryDTO } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = `${
  import.meta.env.VITE_SERVER_URL
}/api/participant-age-category`;

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

export const getParticipant = async (
  participantId: string
): Promise<ParticipantAgeCategoryDTO | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/get-participant/${participantId}`
    );
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return null;
};

export const updateParticipant = async (
  participantAgeCategoryDTO: ParticipantAgeCategoryDTO
): Promise<ParticipantAgeCategoryDTO | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/update-participant/${participantAgeCategoryDTO.id}`,
      participantAgeCategoryDTO
    );
    return response.data;
  } catch (error: AxiosError | unknown) {
    handleAxiosError(error);
  }

  return null;
};

export const removeParticipantFromAgeCategory = async (
  participantAgeCategoryId: number
): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/remove-from-age-category/${participantAgeCategoryId}`
    );
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};
