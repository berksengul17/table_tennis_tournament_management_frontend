import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/match`;

export const getMatches = async (category: number, age: number) => {
  try {
    const response = await axios.get(`${API_URL}/${category}/${age}`);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};

export const createMatches = async (category: number, age: number) => {
  try {
    const response = await axios.get(`${API_URL}/create/${category}/${age}`);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};
