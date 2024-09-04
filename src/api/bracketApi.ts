import axios, { AxiosError } from "axios";
import { IBracket, RoundSeedResponse } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/bracket`;

export const getWinnersBracket = async (
  category: number,
  age: number
): Promise<IBracket | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/get-winners-bracket/${category}/${age}`
    );
    return response.data ? response.data : null;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return null;
};

export const createWinnersBracket = async (
  category: number,
  age: number
): Promise<IBracket> => {
  try {
    const response = await axios.post(
      `${API_URL}/create-winners-bracket/${category}/${age}`
    );
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return {} as IBracket;
};

export const getLosersBracket = async (
  category: number,
  age: number
): Promise<IBracket | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/get-losers-bracket/${category}/${age}`
    );
    return response.data ? response.data : null;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return null;
};

export const createLosersBracket = async (
  category: number,
  age: number
): Promise<IBracket> => {
  try {
    const response = await axios.post(
      `${API_URL}/create-losers-bracket/${category}/${age}`
    );
    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }

  return {} as IBracket;
};

export const refreshBracket = async (bracketId: number): Promise<IBracket> => {
  try {
    const response = await axios.post(
      `${API_URL}/refresh-bracket/${bracketId}`
    );
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return {} as IBracket;
};

export const connectSeeds = async (
  firstSeedId: number,
  secondSeedId?: number
): Promise<RoundSeedResponse> => {
  try {
    const formData = new FormData();
    formData.append("firstSeedId", firstSeedId.toString());
    if (secondSeedId) {
      formData.append("secondSeedId", secondSeedId.toString());
    }
    const response = await axios.post(`${API_URL}/connect-seeds`, formData);
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return {} as RoundSeedResponse;
};

export const getParticipantCount = async (
  bracketId: number
): Promise<number> => {
  try {
    const response = await axios.get(
      `${API_URL}/get-participant-count/${bracketId}`
    );
    return response.data;
  } catch (e: unknown | AxiosError) {
    handleAxiosError(e);
  }

  return 0;
};
