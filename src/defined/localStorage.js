export const DEFINE_KEY = {
  ACCESS_TOKEN: "accessToken",
  user: "user",
};

const isExist = (key) => {
  let is = window.localStorage.getItem(key);
  if (!is || is === null || is === "" || is === "undefined") {
    return false;
  }
  return true;
};

const getItem = (key) => {
  return window.localStorage.getItem(key);
};

const setItem = (key, value) => {
  window.localStorage.setItem(key, value);
};

const clear = () => {
  Object.keys(window.localStorage).map((key) => {
    if (key !== LocalStorage.DEFINE_KEY.DEVICE_ID) {
      LocalStorage.removeItem(key);
    }
  });
};

const removeItem = (key) => {
  window.localStorage.removeItem(key);
};

const length = typeof window === "undefined" ? 0 : window.localStorage.length;

const key = (index) => {
  return window.localStorage.key(index);
};

const LocalStorage = {
  setItem,
  getItem,
  clear,
  removeItem,
  key,
  length,
  DEFINE_KEY,
  isExist,
};

export default LocalStorage;
