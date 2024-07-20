import axios, { AxiosError } from "axios";
import { TournamentData } from "../pages/BracketPage";
import { handleAxiosError } from "../utils";

const API_URL = "http://localhost:8081/api/bracket";

export const createWinnersBracket = async (
  ageCategory: number
): Promise<TournamentData> => {
  try {
    const response = await axios.post(`${API_URL}/create/${ageCategory}`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return {} as TournamentData;
};
