import axios, { AxiosError } from "axios";
import { ParticipantInputs } from "../type";
import { handleAxiosError } from "../utils";

const API_URL = "http://localhost:8081/api/participant";

export const register = async (participant: ParticipantInputs) => {
  try {
    const response = await axios.post(`${API_URL}/register`, participant);

    return response.data;
  } catch (error: unknown | AxiosError) {
    handleAxiosError(error);
  }
};
// export const getParticipants = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/participants`);

//     return response.data;
//   } catch (error: unknown | AxiosError) {
//     handleAxiosError(error);
//   }
// };

// export const categorizeParticipants = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/participants/categorize`);

//     return response.data;
//   } catch (error: unknown | AxiosError) {
//     handleAxiosError(error);
//   }
// };

// const handleAxiosError = (error: unknown | AxiosError) => {
//   if (axios.isAxiosError(error)) {
//     if (error.response) {
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//     } else if (error.request) {
//       console.log(error.request);
//     } else {
//       console.log("Error", error.message);
//     }
//     console.log(error.config);
//   } else {
//     console.log("Error", error);
//   }
// };
