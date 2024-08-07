import axios, { AxiosError } from "axios";
import { Group } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/group`;

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

export const saveGroups = async (groups: Group[]): Promise<Group[]> => {
  try {
    const response = await axios.post(
      `${API_URL}/save`,
      groups.map((g) => {
        const { id, ...rest } = g;
        return rest;
      })
    );
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return [];
};
