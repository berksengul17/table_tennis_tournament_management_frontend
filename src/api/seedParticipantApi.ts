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
