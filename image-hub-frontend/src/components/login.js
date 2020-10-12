import React from "react";
import Card from "@material-ui/core/Card";
import logo from "../assets/images/logo.png";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import FacebookLogin from 'react-facebook-login';

export function Login(props) {

    let responseFacebook = (response) => {
        if (response.status === "unknown") {
            console.log("Login failed")
        } else {
            props.setFbDatas({
                userID: response.userID,
                name: response.name,
                email: response.email,
                picture: response.picture.data.url,
                post: 1,
                friend: 6
            })
            props.setIsLoggedIn(true)
        }
    }

    return (
        <div className="container">
            <div className="blur"/>
            <Card variant="outlined" className="card--login">
                <div className="logo">
                    <img height="100px" src={logo} alt=""/>
                </div>
                <CardContent>
                    <p>Üdvözlünk az ImageHub oldalán.</p>
                </CardContent>
                <CardActions>
                    <FacebookLogin
                        appId="374684060607020"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}/>
                </CardActions>
            </Card>

        </div>
    )
}