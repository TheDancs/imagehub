import React, {useContext} from "react";
import UserDataContext from "../context/UserDataContext";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import RecipeReviewCard from "./post";

export function Profile() {
    const userData = useContext(UserDataContext);

    return (
        <Container maxWidth="lg">
            <Typography className="main--content">
                <div className="user--data">
                    <h1>{userData.name}</h1>
                    <p>{userData.post} bejegyzés, {userData.friend} barát</p>
                </div>
                <RecipeReviewCard />
            </Typography>
        </Container>

    )
}