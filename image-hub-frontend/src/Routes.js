import React from "react";
import {Route, Switch} from "react-router-dom";
import {Upload} from "./components/upload";
import {Feed} from "./components/feed";
import {Profile} from "./components/profile";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Profile/>
            </Route>
            <Route exact path="/feed">
                <Feed/>
            </Route>
            <Route exact path="/upload">
                <Upload/>
            </Route>
            <Route exact path="/profile">
                <Profile/>
            </Route>
        </Switch>
    );
}