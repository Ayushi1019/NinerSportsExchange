import axios from 'axios';
import {message} from "antd";

export const BASE_URL = "http://localhost:8080";

export let axiosJSON;

axiosJSON = axios.create({
  baseURL: BASE_URL,
  headers:{
    'Access-Control-Allow-Origin':'*'
  }
});

// axiosJSON.interceptors.request.use(function (config) {
//   let user = localStorage.getItem("user")
//   let token = JSON.parse(user)["token"]
//   config.defaults.headers['authorization'] = "Token " + token;

//   return config;
// },function (error){
//   message.error("Unauthorized")
//   localStorage.clear();
//   window.location.reload()
// });

axiosJSON.interceptors.response.use(
  res => {
    return res
  },
  error => {
    console.log(error)
    if (error.response.status === 401) {
      delete axiosJSON.defaults.headers['authorization'];
      localStorage.clear();
      window.location.reload()
    } else {
      message.error("Server error")
    }
  })


export default axiosJSON;


