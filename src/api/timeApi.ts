import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";
import { Time } from "../type";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/time`;

export const getAllTimes = async (): Promise<Time[]> => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return [];
};
