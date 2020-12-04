import React from "react";
import { Route, Switch } from "react-router-dom";
import { Upload } from "./components/upload";
import { Feed } from "./components/feed";
import { Profile } from "./components/profile";
import { Callback } from "./components/auth/callback";
import { Logout } from "./components/auth/logout";
import { LogoutCallback } from "./components/auth/logoutCallback";
import { PrivateRoute } from "./routes/privateRoute";
import { SilentRenew } from "./components/auth/silentRenew";

export const Routes = (
  <Switch>
    <Route exact={true} path="/signin-oidc" component={Callback} />
    <Route exact={true} path="/logout" component={Logout} />
    <Route exact={true} path="/logout/callback" component={LogoutCallback} />
    <Route exact={true} path="/silentrenew" component={SilentRenew} />
    <PrivateRoute path="/" component={Feed} />
    <PrivateRoute path="/profile" component={Profile} />
    <PrivateRoute path="/upload" component={Upload} />
  </Switch>
);
