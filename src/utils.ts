import axios, { AxiosError } from "axios";

export const handleAxiosError = (error: unknown | AxiosError) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  } else {
    console.log("Error", error);
  }
};
