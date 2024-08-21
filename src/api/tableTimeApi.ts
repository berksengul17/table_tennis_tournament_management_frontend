import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/table-time`;

export const getTableTime = async (tableId: number, timeId: number) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        tableId,
        timeId,
      },
    });
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};
