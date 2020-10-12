import React from "react";
import Card from "@material-ui/core/Card";
import logo from "../assets/images/logo.png";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

export function Login(props) {
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
                    <Button variant="outlined" className="card--login__button--login" color="primary"
                            onClick={() => props.setIsLoggedIn(true)}>
                        Bejelentkezés
                    </Button>
                </CardActions>
            </Card>

        </div>
    )
}