import React, { useState, useEffect } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';

const url = "https://imagehub.azurewebsites.net/api/v2.0/Feed";

const useStyles = makeStyles((theme) => ({
    container:{
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
        paddingTop: '100.00%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));


export function Feed() {

    const [Posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setPosts(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])
  const classes = useStyles();

  if (error) {
    return <div className="main--content">Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className="main--content">Loading...</div>;
  } else {
    return (
        
        <div className="main--content">
            <p className={classes.container}>
            {Posts.map((post) => {
                return (
                    <Card className={classes.root}>
                        <CardHeader
                        title={post.uploader.name}
                            avatar={
                                <Avatar aria-label="recipe" className={classes.avatar}>
                                    {(post.uploader.name ? post.uploader.name.charAt(0) : "A")}
                                </Avatar>
                            }
                            
                        />
                        <CardMedia
                            className={classes.media}
                            image={post.pictureUrl}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {post.description}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to favorites">
                            <FavoriteIcon />
                            {post.likes}
                            </IconButton>

                        </CardActions>
                    </Card>
                );
            }

            )
            }
            </p>
           
        </div>
    )
}}
