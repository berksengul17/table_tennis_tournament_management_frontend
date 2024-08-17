import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/hotel`;

export const getHotelOptions = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};
