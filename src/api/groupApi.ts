import axios, { AxiosError } from "axios";
import { Group } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = "http://localhost:8081/api/group";

export const createGroupsForAgeCategory = async (
  ageCategory: number
): Promise<Group[]> => {
  try {
    const response = await axios.post(`${API_URL}/create/${ageCategory}`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const getGroupsForAgeCategory = async (
  ageCategory: number
): Promise<Group[]> => {
  try {
    const response = await axios.get(`${API_URL}/load/${ageCategory}`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const getAllGroups = async (): Promise<Group[]> => {
  try {
    const response = await axios.get(`${API_URL}/load-all`);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};
