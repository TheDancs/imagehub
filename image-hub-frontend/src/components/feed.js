import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import CreatePost, { LoadingPost } from "./post";
import { ShowError, ShowInfo } from "./alert";
import { FetchUrl } from "./profile";

const url = "https://imagehub.azurewebsites.net/api/v2.0/Feed";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 450,
    marginRight: "auto",
    marginLeft: "auto",
  },
  root: {
    maxWidth: 450,
    marginbottom: 15,
  },
  media: {
    height: 0,
    paddingtop: "100.00%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export const Feed = () => {
  const [isLoaded, setIsLoaded] = useState(null);
  const [error, setError] = useState(false);
  const [Posts, setPosts] = useState(null);

  if (!isLoaded)
    FetchUrl(url)
      .then(posts => setPosts(posts) )
      .catch(err =>  setError(err) )
      .finally(() => setIsLoaded(true));

  const classes = useStyles();
  if (error) {
    return (
      <div className="main--content">
        <div className={classes.container}>
          {ShowError("Couldn't load feed", error.toString())}
        </div>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className="main--content">
        <div className={classes.container}>{LoadingPost()}</div>
        <div className={classes.container}>{LoadingPost()}</div>
        <div className={classes.container}>{LoadingPost()}</div>
      </div>
    );
  } else if (Posts.length === 0) {
    return (
      <div className="main--content">
        <div className={classes.container}>
          {ShowInfo("No posts at this moment", "There is nothing to see here.")}
        </div>
      </div>);
  } else {
    return (
      <div className="main--content">
        <div className={classes.container}>
          {Posts.map((post) => {
            return CreatePost(post);
          })}
        </div>
      </div>
    );
  }
}
