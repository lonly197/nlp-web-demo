import axios from "axios";

export const HTTP = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000, // 请求超时时间(1min)
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});
