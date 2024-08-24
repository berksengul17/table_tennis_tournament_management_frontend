import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";
import { SeedParticipant } from "../type";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/seed-participant`;

export const getSeedParticipants = async (
  seedId: number
): Promise<SeedParticipant[]> => {
  try {
    const response = await axios.get(`${API_URL}/${seedId}`);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return [];
};

export const saveScores = async (
  seedId: number,
  p1Score: string,
  p2Score: string
) => {
  try {
    const formData = new FormData();
    formData.append("seedId", seedId.toString());
    formData.append("p1Score", p1Score);
    formData.append("p2Score", p2Score);
    const response = await axios.post(`${API_URL}/save-scores`, formData);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};
