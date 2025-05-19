import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // URL do FastAPI
});

export default api;
