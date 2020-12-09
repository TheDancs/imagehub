import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core/styles';
import { FetchUrl, postData,} from './profile';
import { ShowError, ShowInfo, ShowSuccess } from './alert';
import { Typography } from '@material-ui/core';
import { FriendRequestResultCard, ListResultCard, LoadingResultCards } from './ResultCards';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

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
    padding: theme.spacing(2, 4, 3),
    width: "400px"
  },
  likeButton: {
    textalign: "left",
    margin: 0,
    justifyContent: "flex-start",
  },
}));

async function AcceptRequest(id) {
  var res = await postData("https://imagehub.azurewebsites.net/api/v2.0/friendrequest/accept/"+id);
  return res;
}
async function RejectRequest(id) {
  var res = await postData("https://imagehub.azurewebsites.net/api/v2.0/FriendRequest/reject/"+id);
  return res;
}

export function FriendRequests(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [reqs, setRequs] = useState(props.requs);


  async function handleRequest(id, accept){
    if(accept && await AcceptRequest(id)===200)
    {
      var i= 0;
      if(reqs.length > 1)
        while (i <reqs.length) {
          if (reqs[i].id === id) {
            setRequs(reqs.splice(i, 1));
          } else {
            ++i;
          }
        }
      else
      await setRequs([]);
      await setMessage(ShowSuccess("Congrats!", "you got a new friend"));
    }
    else if(!accept &&  await RejectRequest(id) === 200)
    {
      var i=0;
      if(reqs.length > 1)
        while (i <reqs.length) {
          if (reqs[i].id === id) {
            setRequs(reqs.splice(i, 1));
          } else {
            ++i;
          }
        }
      else
      await setRequs([]);
      await setMessage(null);
    }
    else{
      setMessage(ShowError("Ooops","something went wrong"));
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
  };

  var body;
  var buttonText = "Friend Requests"

  if (reqs && reqs.length > 0) {
    buttonText = "Friend Requests (" + reqs.length + ")";
    body = (
      <div>
        <Typography variant="h5" id="simple-modal-title">Friend requests</Typography>
        {message}
        <List dense className={classes.root}>
          {reqs.map((req) => {
            return (
              <div key={req.id}>
                            <FriendRequestResultCard user={req.from} reqId={req.id} handle={handleRequest}/>
                        </div>
            );
          })
          }
        </List>
      </div>
    );
  }
  else {
    body = (
      <div>
        <Typography variant="h5" id="simple-modal-title">Friend requests</Typography>
        {ShowInfo("No friend requests", "Nobody want to be friends with you")}
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

//args.id
export function ViewFriends(args) {
  const vf_classes = useStyles();

  const url ="https://imagehub.azurewebsites.net/api/v2.0/User/"+args.id+"/friends";
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null)

  //Fetch friends
  async function GetFriends() {
    await FetchUrl(url)
    .then(re => setFriends(re))
    .catch(er => setError(er))
    .finally(()=> setIsLoaded(true));
}
  if(!isLoaded)
    GetFriends();

  function handleOpen() {
    setOpen(true);
    setIsLoaded(false);
  }

  const handleClose = () => {
    setOpen(false);    
  };

  var body;

if(error || !friends || friends.length<=0) 
{
  if(error)
    body = (<>{ShowError("Couldn't load list", error.message)}</>);
  else
    body = (<> {ShowInfo("No friends", "You don't have any friends.")}</>);
}
else if(!isLoaded)
{
  body = (
    <div>
      <LoadingResultCards />
      <LoadingResultCards />
      <LoadingResultCards />
      <LoadingResultCards />
      <LoadingResultCards /> 
    </div>
    );
}
else{
  body = (
    <div>
      <Typography variant="h5" id="simple-modal-title">Friends</Typography>
      <List dense>
        {friends.map((friend) => {
         return (                        
          <div key={friend.id}>
              <ListResultCard user={friend}/>
          </div>
          );
        })}        
      </List>
    </div>
  );
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
          <Paper elevation={4} className={vf_classes.paper}>
            {body}
          </Paper>
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
       <Typography variant="h5" id="simple-modal-title">People who liked</Typography>
      <List dense>
          {props.likes.map((like) => {
            return (
              <div key={like.user.id}>
              <ListResultCard user={like.user}/>
           </div>
         );
       })
       }
        </List>
      </div>
    );
  }
  else {
    body = (
      <div>
         <Typography variant="h5" id="simple-modal-title">Friends</Typography>
        <div id="simple-modal-description">
          {ShowInfo("No likes", "Nobody like this.")}
        </div>
      </div>);
  }
  return (
    <div>
      
      <Button className={vf_classes.likeButton} variant="text" onClick={()=>handleOpen()}>
        <Typography variant="h6">
        {props.numberOfLikes}
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