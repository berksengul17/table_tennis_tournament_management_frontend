import axios, { AxiosError } from "axios";
import { AgeCategory } from "../type";
import { handleAxiosError } from "../utils";
const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/age-category`;

export const createAgeCategories = async (): Promise<AgeCategory[]> => {
  try {
    const response = await axios.post(`${API_URL}/create-categories`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const getAgeCategories = async (): Promise<AgeCategory[]> => {
  try {
    const response = await axios.get(`${API_URL}/load-categories`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const getAllCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/get-categories`, {
      params: { showDoubles: true },
    });
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const getAgeListByCategoryAndGender = async (
  category?: number,
  gender?: string
): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/get-age-list`, {
      params: { gender, category },
    });
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};
