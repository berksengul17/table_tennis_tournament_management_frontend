import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/tournament-img`;

export const getImage = async (): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return {} as Blob;
};

export const saveImage = async (tournamentName: string, image: File | null) => {
  try {
    const formData = new FormData();
    formData.append("tournamentName", tournamentName);
    formData.append("image", image!);
    await axios.post(`${API_URL}/save`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};
