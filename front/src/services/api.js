import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7777", 
});

export default API;
