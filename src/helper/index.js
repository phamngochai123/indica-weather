import { unitType } from "../defined";
import LocalStorage from "../defined/localStorage";

export const getLabelUnitTemp = (unit) => {
  return unit === unitType.metric ? "°C" : "°F";
};
export const getLabelUnitSpeed = (unit) => {
  return unit === unitType.metric ? "m/s" : "mile/h";
};
export const isLogin = () => {
  return LocalStorage.getItem(LocalStorage.DEFINE_KEY.user) ? true : false;
};
export const getUserData = () => {
  return isLogin()
    ? JSON.parse(LocalStorage.getItem(LocalStorage.DEFINE_KEY.user))
    : null;
};
