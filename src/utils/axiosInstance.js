import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://rivanoo-germany-d06b208bf8db.herokuapp.com/api/",
});

export default axiosInstance;
