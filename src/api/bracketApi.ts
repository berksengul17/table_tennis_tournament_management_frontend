import axios, { AxiosError } from "axios";
import { IBracket } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = "http://localhost:8081/api/bracket";

export const createWinnersBracket = async (
  ageCategory: number
): Promise<IBracket> => {
  try {
    const response = await axios.post(`${API_URL}/create/${ageCategory}`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return {} as IBracket;
};
