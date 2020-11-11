import React, { useState, useEffect,useContext } from "react";
import UserDataContext from "../context/UserDataContext";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

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
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export function ViewFriends() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [friends, setFriends] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  useEffect(() => {
    fetch("https://imagehub.azurewebsites.net/api/v2.0/User/me")
  .then(res => res.json())
  .then(
    (result) => {
      setFriends(result.friends);
    }
  )
}, [])

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Friends</h2>
      <p id="simple-modal-description">
        {friends.map((friend)=> {
                return (
                <p>{friend.name}</p>
                );
        })
        }
      </p>
    </div>
  );

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Friend list
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
export function FrienRequests() {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [requests, setRequests] = useState([]);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const acceptRequest = (id) => {
            fetch("https://imagehub.azurewebsites.net/api/v2.0/User/friendrequests/"+{id}+"/accept");

    };
    const rejectRequest = (id) => {
        
            fetch("https://imagehub.azurewebsites.net/api/v2.0/User/friendrequests/"+{id}+"/reject");
    };
  
    
    useEffect(() => {
      fetch("https://imagehub.azurewebsites.net/api/v2.0/User/friendrequests")
    .then(res => res.json())
    .then(
      (result) => {
        setRequests(result);
      }
    )
  }, [])
  
    const body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Friend requests</h2>
        <p id="simple-modal-description">
          {requests.map((req)=> {
                  return (
                      <div>
                    <p>{req.from.name}</p>
                  <Button variant="contained" onClick={acceptRequest(req.id)}>Accept</Button>
                  <Button variant="outlined" onClick={rejectRequest(req.id)}>Reject</Button>
                      </div>                  
                  );
          })
          }
        </p>
      </div>
    );
  
    return (
      <div>
        <Button variant="outlined" onClick={handleOpen}>
          Friend Requests
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </div>
    );
}

export function Profile() {
    
    const userData = useContext(UserDataContext);
    var url = "https://imagehub.azurewebsites.net/api/v2.0/Feed/user/"+userData.userId;

    const [Posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [friends, setFriends] = useState([]);
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
  useEffect(() => {
    fetch("https://imagehub.azurewebsites.net/api/v2.0/User/me")
  .then(res => res.json())
  .then(
    (result) => {
      setFriends(result.friends);
    }
  )
}, [])
  const classes = useStyles();
    return (
        <Container maxWidth="lg">
            <Typography className="main--content">
                <div className="user--data">
                    <h1>{userData.name}</h1>
                    <p>{Posts.length} bejegyzés, {friends.length} barát</p>
                    <p><ViewFriends/> </p>
                    <p><FrienRequests/></p>
                </div>
                
            <p> {Posts.map((post) => {
                return (
                    <Card className={classes.root}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="recipe" className={classes.avatar}>
                                    {(post.uploader.name ?post.uploader.name.charAt(0) : "A")}
                                </Avatar>
                            }
                            title={post.uploader.name}
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
            }</p>
            </Typography>
        </Container>

    )
}