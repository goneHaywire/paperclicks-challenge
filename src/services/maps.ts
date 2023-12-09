import axios from "axios";

const API = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/textsearch/json",
  params: {
    key: import.meta.env.VITE_GMAPS_API_KEY,
  },
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

const MapService = {
  search: (query) => API.get("", { params: { query } }),
};

export default MapService;
