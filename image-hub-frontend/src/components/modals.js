import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { FetchUrl, postData, SendFriendRequest, Unfriend } from './profile';
import { ShowInfo } from './alert';
import { Avatar, Typography } from '@material-ui/core';
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import { UnfoldMoreOutlined } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: 'inherit',
    paddingLeft: '25px'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: '60vh !important',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  btns: {
    position: 'relative',
    maxwidth: 400,
    padding: theme.spacing(2),
  },
  searchIcon: {
    padding: theme.spacing(0, 0),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxwidth:'400px',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "400px"
  },
  likeButton: {
    textalign: "left",
    margin: 0,
    justifyContent: "flex-start",
  },
}));

function AcceptRequest(id) {
  postData("https://imagehub.azurewebsites.net/api/v2.0/User/friendrequests/" + { id } + "/accept");
}
function RejectRequest(id) {
  postData("https://imagehub.azurewebsites.net/api/v2.0/User/friendrequests/" + { id } + "/reject");
}

//@Todo: Url-ek beírása
function AddOrRemoveFriend(id, remove) {
  if (remove)
  Unfriend(id);
  else    
    SendFriendRequest(id);
}

export function FriendRequests(requs = []) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  var body;
  var buttonText = "Friend Requests"

  if (requs && requs.length > 0) {
    buttonText = "Friend Requests (" + requs.length + ")";
    body = (
      <div>
        <h2 id="simple-modal-title">Friend requests</h2>
        <div id="simple-modal-description">
          {requs.map((req) => {
            return (
              <div>
                <Avatar src={req.userSummary.profilePicture} />
                <div>{req.userSummary.name}</div>
                <Button variant="contained" onClick={AcceptRequest(req.id)}>Accept</Button>
                <Button variant="outlined" onClick={RejectRequest(req.id)}>Reject</Button>
              </div>
            );
          })
          }
        </div>
      </div>
    );
  }
  else {
    body = (
      <div>
        <h2 id="simple-modal-title">Friend requests</h2>
        {ShowInfo("No friend requests", "Nobody wants to be friends with you")}
      </div>
    );
  }


  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        {buttonText}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {body}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export function ViewFriends(friendsList = []) {
  const vf_classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  var body;
  if (friendsList && friendsList.length > 0) {
    body = (
      <div>
        <h2 id="simple-modal-title">Friends</h2>
        <div id="simple-modal-description">
          {friendsList.map((friend) => {
            return (
              <div>
                <Avatar src={friend.profilePicture} />
                {friend.name}
                <Button onClick={AddOrRemoveFriend(friend.id, friend.isFriend)}>
                  {friend.isFriend ? "Delete friend" : "Add friend"}
                </Button>
              </div>
            );
          })
          }
        </div>
      </div>
    );
  }
  else {
    body = (
      <div>
        <h2 id="simple-modal-title">Friends</h2>
        <div id="simple-modal-description">
          {ShowInfo("No friends", "You don't have any friends.")}
        </div>
      </div>);
  }
  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Friend list
        </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={vf_classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={vf_classes.paper}>
            {body}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export function Search(toFind) {
  console.log("searched to " + toFind);
}

export function SearchResult() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [search_value, setSearchValue] = useState("");
  const [search_result, setSearchResult] = useState([]);
  const [isLoaded, setIsloaded] = useState(false);
  const [url, setUrl] = useState("https://imagehub.azurewebsites.net/api/v2.0/User/search/");


  const handleOpen = (event) => {
    var search_bar = document.getElementById("search_bar");
    if (event.key === "Enter") {
            setSearchValue(search_bar.value);

      setUrl("https://imagehub.azurewebsites.net/api/v2.0/User/search/" + search_bar.value);

      if(!isLoaded)
      FetchUrl(url).then(result => setSearchResult(result))
      .catch(error => console.log(error))
      .finally(() => {setIsloaded(true);setOpen(true);});
    }

  };

  const handleClose = () => {
    setOpen(false);
    setIsloaded(false);
  };

  var content;
  if(isLoaded && search_result.length===0)
    content = ShowInfo("Result", "No result for '" + search_value + "'");

  else if (!isLoaded)
    content = "Loading...";
  else
    content = (
      <>
        {search_result.map((friend) => {
          return (
            <div key={friend.id}>
               <Grid container spacing={3} xs={12} alignitems="center" justifycontent="flex-start">
        <Grid item   >
        <Avatar src={friend.profilePictureUrl} />
       
        </Grid>
        <Grid item>
        {friend.name}
        </Grid>
        <Grid container  xs={5} aligncontent="center" justifycontent="flex-end">
          <Grid item >
          <Button variant="outlined" onClick={()=> AddOrRemoveFriend(friend.id, friend.isFriend)}>
                {friend.isFriend ? "Delete friend" : "Add friend"}
              </Button>
          </Grid>
        
        </Grid>
      </Grid>
            </div>
          );
        })
        }
      </>
    );
  return (
    <div>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <TextField onKeyUp={handleOpen}

        id="search_bar"
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.Modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div>
              <h2 id="simple-modal-title">Search result to "{search_value}"</h2>
              <div className={classes.btns}>
                {content}

              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}



export function PostLikes(props){
  
  const vf_classes = useStyles();
  const [open, setOpen] = useState(false);  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  var body;
  if (props.likes && props.likes.length > 0) {
    body = (
      <div>
        <h2 id="simple-modal-title">People who liked</h2>
        <div id="simple-modal-description">
          {props.likes.map((like) => {
            return (
              <div>
                <Avatar src={like.profilePictureUrl} />                
                <Button variant="text">
                {like.name}
                </Button>
              </div>
            );
          })
          }
        </div>
      </div>
    );
  }
  else {
    body = (
      <div>
        <h2 id="simple-modal-title">People who liked</h2>
        <div id="simple-modal-description">
          {ShowInfo("No likes", "Nobody likes this.")}
        </div>
      </div>);
  }
  return (
    <div>
      
      <Button className={vf_classes.likeButton} variant="text" onClick={()=>handleOpen()}>
        <Typography variant="h6">
        {props.likes.length.toString()}
        </Typography>
          
        </Button>
        
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={vf_classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={vf_classes.paper}>
            {body}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}