import React, {useState} from 'react';
import './App.css';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";
import {Login} from "./components/login";
import Routes from "./Routes";
import PrimarySearchAppBar from "./components/app-bar";
import UserDataContext from "./context/UserDataContext";

const styles = {};

styles.fill = {
    position: "relative",
    height: "100%",
    width: "100%"
}

styles.content = {
    ...styles.fill
}


function App() {
    let [isLoggedIn, setIsLoggedIn] = useState(true)
    let [fbDatas, setFbDatas] = useState({
        userID: '',
        name: '',
        email: '',
        picture: ''
    })

    const theme = createMuiTheme({
        palette: {
            primary: blue,
        },
    })
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} setFbDatas={setFbDatas}/>}
                <UserDataContext.Provider value={fbDatas}>
                    {isLoggedIn && <PrimarySearchAppBar setIsLoggedIn={setIsLoggedIn}/>}
                    {isLoggedIn && <Routes/>}
                </UserDataContext.Provider>

            </ThemeProvider>
        </div>
    );
}

export default App;
