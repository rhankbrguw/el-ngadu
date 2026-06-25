import axios from "axios";

const api = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL,
 withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    // Unwrap the new API envelope for success
    if (response.data && response.data.success === true) {
      if (response.data.data !== undefined) {
        // We keep the message attached just in case some legacy code needs response.data.message
        return { ...response, data: { ...response.data.data, message: response.data.message } };
      }
    }
    return response;
  },
  (error) => {
    // Map the new API envelope back to the legacy format the frontend expects
    if (error.response && error.response.data && error.response.data.success === false) {
      error.response.data.error = error.response.data.message;
      if (error.response.data.errors) {
         error.response.data.validation_errors = error.response.data.errors;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
