import axios, { AxiosError } from "axios";
import { AgeCategory } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = "http://localhost:8081/api/age-category";

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
    const response = await axios.get(`${API_URL}/get-categories`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const getAgeListByCategory = async (
  category: number
): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/get-age-list`, {
      params: { category },
    });
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};
