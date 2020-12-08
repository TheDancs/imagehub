import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import React, { useState } from 'react';
import { Button, Grid, Link } from "@material-ui/core";
import { FetchUrl, postData } from "./profile";
import { AuthManager } from "../providers/authProvider";
import { PostLikes } from "./modals";


//postId
//likes
export default function LikeButton(args) {
    const url = "https://imagehub.azurewebsites.net/api/v2.0/Post/" + args.postId + "/likes";

    const [liked, setLiked] = useState(false);
    const [likesList, setLikesList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [numberOfLikes, setNumberOfLikes] = useState(args.likes);

    if (!isLoaded) {
        FetchUrl(url)
            .then(re => setLikesList(re))
            .catch(err => setError(err))
            .finally(setIsLoaded(true));       
    }
    if(isLoaded && likesList.length <= numberOfLikes)
        AuthManager.getUser().then((user) => {
            likesList.forEach(like => {
                if (like.user.id === user.profile.sub)
                    setLiked(true);
            })
        });      
    return (

        <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item>
                <IconButton aria-label="Likes" onClick={() => { LikePost(args.postId, liked, setLiked, setNumberOfLikes, numberOfLikes, setIsLoaded); }}>
                    <FavoriteIcon fontSize="large" color={liked ? "secondary" : "inherit"} />
                </IconButton>
            </Grid>
            <Grid item>
                <PostLikes likes={likesList} numberOfLikes={numberOfLikes} />
            </Grid>
        </Grid>
    );


}

async function LikePost(id, liked, setliked, setnumber, num, isloaded) {
    if (!liked){
        var url = "https://imagehub.azurewebsites.net/api/v2.0/Post/" + id + "/like";
    }        
    else{
        var url = "https://imagehub.azurewebsites.net/api/v2.0/Post/" + id + "/unlike";
        
       
    }
    if(await postData(url) === 200)
    {
        liked? await setnumber(num-1):  await setnumber(num+1);
        await setliked(!liked);
        await isloaded(false);
    }
        
}