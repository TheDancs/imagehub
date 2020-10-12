import React from "react";
import { Route, Switch } from "react-router-dom";
import {MainContent} from "./components/main-content";
import {Upload} from "./components/upload";
import {Feed} from "./components/feed";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <MainContent />
            </Route>
            <Route exact path="/feed">
                <Feed />
            </Route>
            <Route exact path="/upload">
                <Upload />
            </Route>
        </Switch>
    );
}