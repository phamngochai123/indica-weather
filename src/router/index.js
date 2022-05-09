import React from "react";
import {
  HashRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { ROUTER_NAME } from "./routers";
import HomePage from "../pages/home";
import Login from "../pages/login";
import PageNotFound from "../pages/not-found";
import LocalStorage from "../defined/localStorage";

const router = [
  {
    path: "/",
    component: Login,
    isLogin: true,
  },
  {
    path: ROUTER_NAME.login,
    component: Login,
    isLogin: true,
  },
  {
    path: ROUTER_NAME.home,
    component: HomePage,
  },
  {
    path: "*",
    component: PageNotFound,
    isNotPrivate: true,
  },
];

// Pages

const RouteNavigation = () => {
  return (
    <Router>
      <Routes>
        {router.map((route, index) => {
          const Component = route.component;
          return (
            <Route
              path={route.path}
              element={
                !LocalStorage.getItem(LocalStorage.DEFINE_KEY.user) ? (
                  route.isLogin || route.isNotPrivate ? (
                    <Component />
                  ) : (
                    <Navigate to={ROUTER_NAME.login} replace />
                  )
                ) : route.isLogin ? (
                  <Navigate to={ROUTER_NAME.home} replace />
                ) : (
                  <Component />
                )
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
};
export default RouteNavigation;
