import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";
import { Admin } from "../type";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/admin`;

export const loginAdmin = async (
  username: string,
  password: string
): Promise<Admin | null> => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const response = await axios.post(`${API_URL}/login`, formData);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return null;
};
