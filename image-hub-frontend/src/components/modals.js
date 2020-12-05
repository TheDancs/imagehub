import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { FetchUrl, postData } from './profile';
import { ShowInfo } from './alert';
import { Avatar } from '@material-ui/core';

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
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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
    postData("DeleteURL" + id);
  else
    postData("AddUrl" + id);
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


  const handleOpen = (event) => {
    var search_bar = document.getElementById("search_bar");
    if (event.key === "Enter") {
      setSearchValue(search_bar.value);
      Search(search_value)
      var url = "https://imagehub.azurewebsites.net/api/v2.0/User/search/" + search_value;

      FetchUrl(url).then(result => setSearchResult(result)).catch(error => console.log(error));
      setOpen(true);
    }

  };

  const handleClose = () => {
    setOpen(false);
  };

  var content;
  if (search_result.length > 0)
    content = (
      <>
        {search_result.map((friend) => {
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
      </>
    );
  else
    content = ShowInfo("Result", "No result for '" + search_value + "'");

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