import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";
import { Table } from "../type";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/table`;

export const getAllTables = async (): Promise<Table[]> => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return [];
};
