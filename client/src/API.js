import axios from "axios";
import { API } from "./keys.json";
export default axios.create({
  baseURL: API,
  withCredentials: true,
});
