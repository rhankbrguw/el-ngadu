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
        const payload = response.data.data;
        if (Array.isArray(payload)) {
          return { ...response, data: payload };
        }
        if (typeof payload === "object" && payload !== null) {
          return { ...response, data: { ...payload, message: response.data.message } };
        }
        return { ...response, data: payload };
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
