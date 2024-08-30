import axios, { AxiosError } from "axios";
import { Group } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/group`;

export const createGroupsForAgeCategoryAndAge = async (
  category: number,
  age: number,
  refresh: boolean = false
): Promise<Group[]> => {
  try {
    const formData = new FormData();
    formData.append("refresh", refresh ? "true" : "false");
    const response = await axios.post(
      `${API_URL}/create/${category}/${age}`,
      formData
    );
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};

export const getGroupsForAgeCategoryAndAge = async (
  category: number,
  age: number
): Promise<Group[]> => {
  try {
    const response = await axios.get(`${API_URL}/load/${category}/${age}`);
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

export const saveGroups = async (groups: Group[]): Promise<Group[]> => {
  try {
    const response = await axios.post(`${API_URL}/save`, groups);
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};
