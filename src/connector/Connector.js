import axios from "axios";

const apiKey = "aa25f279d0cbd22920365520ed05c261";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
const apiUrlSuggestLocation = "https://api.openweathermap.org/geo/1.0/direct";
const urlIcon = "https://openweathermap.org/img/wn/";
const apiEndPoint = {
  weather: "weather",
  onecall: "onecall",
};
const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
});
const baseParams = {
  appid: apiKey,
};
export const searchLocation = (inputSearch) => {
  return axiosInstance.get(apiEndPoint.weather, {
    params: { ...baseParams, q: inputSearch },
  });
};
export const getSuggest = (inputSearch) => {
  return axios.get(apiUrlSuggestLocation, {
    params: { ...baseParams, q: inputSearch, limit: 5 },
  });
};
export const getOneCallWeather = (params) => {
  return axiosInstance.get(apiEndPoint.onecall, {
    params: { ...baseParams, ...params, exclude: "minutely,alerts" },
  });
};
export const getUrlIcon = (icon) => {
  return urlIcon + icon + "@2x.png";
};
