import React, { Component } from "react";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import { Routes } from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/authProvider";

const styles = {};

styles.fill = {
  position: "relative",
  height: "100%",
  width: "100%",
};

styles.content = {
  ...styles.fill,
};

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

export class App extends Component {
  render() {
    return (
      <div className="App">
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <BrowserRouter children={Routes} basename={"/"}>
              
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </div>
    );
  }
}
