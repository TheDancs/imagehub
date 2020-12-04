import React, { useState } from "react";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import { Login } from "./components/login";
import {Routes} from "./Routes";
import { BrowserRouter } from "react-router-dom";
import PrimarySearchAppBar from "./components/app-bar";
import UserDataContext from "./context/UserDataContext";
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

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: blue,
    },
  });
  return (
    <div className="App">
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <PrimarySearchAppBar />
          <BrowserRouter children={Routes} basename={"/"} />
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
