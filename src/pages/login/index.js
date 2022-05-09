import React from "react";
import { GoogleLogin } from "react-google-login";

import { FacebookProvider, Login } from "react-facebook";
import "./index.css";
import LocalStorage from "../../defined/localStorage";

const LoginPage = () => {
  const responseFacebook = (res) => {
    console.log("responseFacebook=>", res);
    LocalStorage.setItem(LocalStorage.DEFINE_KEY.user, JSON.stringify(res));
    window.location.reload();
  };
  const responseFacebookError = (res) => {
    console.log("responseFacebookError=>", res);
  };
  const responseGoogle = (res) => {
    console.log("responseGoogle=>", res);
    LocalStorage.setItem(LocalStorage.DEFINE_KEY.user, JSON.stringify(res));
    window.location.reload();
  };
  const responseGoogleFailed = (res) => {
    console.log("responseGoogleFailed=>", res);
  };
  return (
    <div className="container-login">
      <h1>LOGIN</h1>
      <div className="wrap-action-login">
        <div>
          <FacebookProvider appId="129989492223277">
            <Login
              scope="email"
              onCompleted={responseFacebook}
              onError={responseFacebookError}
            >
              {({ loading, handleClick, error, data }) => (
                <div className="btn-login-facebook" onClick={handleClick}>
                  <img
                    className="img"
                    src="https://scontent.fhan4-1.fna.fbcdn.net/v/t39.2365-6/17639236_1785253958471956_282550797298827264_n.png?_nc_cat=105&amp;ccb=1-6&amp;_nc_sid=ad8a9d&amp;_nc_ohc=6MUTjRlLnH4AX-rSg_d&amp;_nc_ht=scontent.fhan4-1.fna&amp;oh=00_AT_SgEzUK3xX6lOw5vWmitt8cmqL07j76G60VHfU-gQqDg&amp;oe=627E5BD6"
                    width="200"
                    alt=""
                  ></img>
                </div>
              )}
            </Login>
          </FacebookProvider>
        </div>
        <div>
          <GoogleLogin
            clientId="611302820196-lsi40vdmqbmunt9ls3aorggq117c3ckc.apps.googleusercontent.com"
            buttonText="Login with google"
            onSuccess={responseGoogle}
            onFailure={responseGoogleFailed}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
