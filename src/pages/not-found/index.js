import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { ROUTER_NAME } from "../../router/routers";
export default () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
          <h2>404 - The Page can't be found</h2>
        </div>
        <Link to={ROUTER_NAME.login}>Go TO Homepage</Link>
      </div>
    </div>
  );
};
