import { UserManager, WebStorageStateStore, Log } from "oidc-client";
import axios from "axios";

export default class AuthService {
  UserManager;

  constructor() {
    console.log(process.env);
    this.UserManager = new UserManager({
      authority: process.env.REACT_APP_AUTH_URL,
      client_id: "image_hub_client",
      redirect_uri: process.env.REACT_APP_REDIRECT_URL,
      response_type: "code",
      scope: "openid profile imagehubapi.all",
      post_logout_redirect_uri: process.env.REACT_APP_LOGOFF_REDIRECT_URL,
      automaticSilentRenew: true, //(boolean, default: false): Flag to indicate if there should be an automatic attempt to renew the access token prior to its expiration.
      silent_redirect_uri: process.env.REACT_APP_SILENT_REDIRECT_URL, //(string): The URL for the page containing the code handling the silent renew.
      userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    });
    // Logger
    Log.logger = console;
    Log.level = Log.ERROR;

    this.UserManager.events.addUserLoaded((user) => {
      if (window.location.href.indexOf("signin-oidc") !== -1) {
        console.log(user);
        axios({
          method: "post",
          url: "https://imagehub.azurewebsites.net/api/v2.0/user",
          headers: { Authorization: "Bearer " + user.access_token },
          data: {
            id: user.profile.sub,
            name: user.profile.name,
            email: user.profile.email,
            profilePictureUrl: user.profile.picture,
          },
        }).then(() => {
          this.navigateToScreen();
        }, error => {
          //TODO error page
          this.navigateToScreen();
        });
      }
    });
    this.UserManager.events.addSilentRenewError((e) => {
      console.log("silent renew error", e.message);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      console.log("token expired");
      this.signinSilent();
    });
  }

  signinRedirectCallback = () => {
    this.UserManager.signinRedirectCallback();
  };

  getUser = async () => {
    const user = await this.UserManager.getUser();
    if (!user) {
      return await this.UserManager.signinRedirectCallback();
    }
    console.log(user.access_token);
    return user;
  };

  parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    this.UserManager.signinRedirect({});
  };

  navigateToScreen = () => {
    window.location.replace("/");
  };

  isAuthenticated = () => {
    const oidcStorage = JSON.parse(
      sessionStorage.getItem(
        `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`
      )
    );

    return !!oidcStorage && !!oidcStorage.access_token;
  };

  signinSilent = () => {
    this.UserManager.signinSilent()
      .then((user) => {
        console.log("signed in", user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  signinSilentCallback = () => {
    this.UserManager.signinSilentCallback();
  };

  createSigninRequest = () => {
    return this.UserManager.createSigninRequest();
  };

  logout = () => {
    this.UserManager.signoutRedirect({
      id_token_hint: localStorage.getItem("id_token"),
    });
    this.UserManager.clearStaleState();
  };

  signoutRedirectCallback = () => {
    this.UserManager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      window.location.replace(process.env.REACT_APP_PUBLIC_URL);
    });
    this.UserManager.clearStaleState();
  };
}
