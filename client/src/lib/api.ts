import axios from "axios";

const api = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL || "https://api-elngadu.rhankbrguw.xyz/api",
 withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    // Unwrap the new API envelope for success
    if (response.data && response.data.success === true) {
      if (response.data.data !== undefined) {
        const payload = response.data.data;
        if (Array.isArray(payload)) {
          Object.defineProperty(payload, 'message', { value: response.data.message, enumerable: false });
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
  async (error) => {
    // Retry once on network/CORS error (often caused by IPv6 localhost fallback on first request)
    if (!error.response && error.config && !error.config._retry) {
      error.config._retry = true;
      try {
        return await axios(error.config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

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
