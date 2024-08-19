import axios, { AxiosError } from "axios";
import { handleAxiosError } from "../utils";
import { Match } from "../type";

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

export const saveScores = async (match: Match) => {
  try {
    await axios.post(`${API_URL}/save-scores`, match);
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }
};
