import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/document`;

export const downloadAgeCategoriesPdf = async () => {
  try {
    const response = await axios.get(`${API_URL}/download-age-categories`, {
      responseType: "blob",
    });
    const fileName = "yaş_grupları.pdf";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }
};

export const downloadGroupsPdf = async (category: number, age: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/download-groups/${category}/${age}`,
      {
        responseType: "blob",
      }
    );
    const fileName = "gruplar.pdf";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }
};
