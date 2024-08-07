import axios, { AxiosError } from "axios";
import { IBracket } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/bracket`;

export const getWinnersBracket = async (
  ageCategory: number
): Promise<IBracket | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/get-winners-bracket/${ageCategory}`
    );
    return response.data ? response.data : null;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return null;
};

export const createWinnersBracket = async (
  ageCategory: number
): Promise<IBracket> => {
  try {
    const response = await axios.post(
      `${API_URL}/create-winners-bracket/${ageCategory}`
    );
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return {} as IBracket;
};

export const advanceToNextRound = async (
  participantId: string,
  bracketId: number,
  roundId: number
): Promise<IBracket> => {
  try {
    const formData = new FormData();
    formData.append("participantId", participantId);
    formData.append("bracketId", bracketId.toString());
    formData.append("roundId", roundId.toString());

    const response = await axios.put(
      `${API_URL}/advance-to-next-round`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return {} as IBracket;
};
