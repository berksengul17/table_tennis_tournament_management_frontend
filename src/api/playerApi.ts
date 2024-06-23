import axios, { AxiosError } from "axios";
import { PlayerInputs } from "../type";

const API_URL = "http://localhost:8081/api/player";

export const register = async (player: PlayerInputs) => {
  try {
    const response = await axios.post(`${API_URL}/register`, player);

    return response.data;
  } catch (error: unknown | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Error", error);
    }
  }
};

export const getParticipants = async () => {
  try {
    const response = await axios.get(`${API_URL}/participants`);

    return response.data;
  } catch (error: unknown | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Error", error);
    }
  }
};
