import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import CreatePost, { LoadingPost } from "./post";
import { ShowError } from "./alert";
import { Link } from "react-router-dom";
import PrimarySearchAppBar from "../components/app-bar";
import { AuthManager } from "../providers/authProvider";

const url = "https://imagehub.azurewebsites.net/api/v2.0/Feed";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 450,
    marginRight: "auto",
    marginLeft: "auto",
  },
  root: {
    maxWidth: 450,
    marginBottom: 15,
  },
  media: {
    height: 0,
    paddingTop: "100.00%", // 16:9
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
  const [Posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401)
            throw new Error("You are not logged in.");
          throw new Error(
            "Unknown error (Something wrong with the network response)."
          );
        }
        return response.json();
      })
      .then((result) => {
        setIsLoaded(true);
        setPosts(result);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
      });
  }, []);

  AuthManager.getUser().then(user => console.log(user.access_token));

  const classes = useStyles();
  if (error) {
    return (
      <div className="main--content">
        <div className={classes.container}>
          {ShowError("Couldn't load feed", error.toString())}
          <Link to="/profile">profile</Link>
        </div>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className="main--content">
        <Link to="/profile">profile</Link>
      </div>
    );
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
