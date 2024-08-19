import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";
import { GroupTableTime } from "../type";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/group-table-time`;

export const assignGroupsToTableAndTime = async (): Promise<
  GroupTableTime[]
> => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return [];
};
