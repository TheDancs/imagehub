import React, { useState, useEffect, useContext } from "react";
import UserDataContext from "../context/UserDataContext";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import RecipeReviewCard from "./post";
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import TransitionsModal, { FrienRequests, ViewFriends } from "./modals";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import { ShowError } from "./alert";


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
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  avatarProfile: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  paperRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));


export function Profile(id = 'me') {
  if(typeof id != typeof string)
    id ="me";

  var profileUrl = "https://imagehub.azurewebsites.net/api/v2.0/User/"+id;
  var user;
  user = useContext(UserDataContext);
  if(id != "me" && user == null){
    user = FetchUrl(profileUrl).
    catch(error =>{
      console.log(error);
    } ) 
  }
 
  var frnd = [{name:"csicska 3idjf"}]
  var posts = UserPosts(id);
  var mockuser = {id:22, name: "Károly Kovács", friends: frnd, posts: posts };
    //Fetch user
    return (
      <Container>
        <Typography>
          {ProfileSummary(user)}
          <GridList cols="3" width="800">
            {posts.map((post) => {
              return (
                RecipeReviewCard(post)
              );
            }
  
            )
            }
          </GridList>
  
        </Typography>
     </Container>
  
    )
  


}


export function ProfileSummary(user) {
  const classes = useStyles();
  var requests;
  var me = useContext(UserDataContext);
    
    var rqButton = (<Button >Send FriendRequest</Button>);
    if(me === user){
      console.log("!user");
      
      console.log(user.name);
      requests = GetFriendRequests().catch(error => { console.log(error)});
      rqButton = (FrienRequests(requests))
    }
    
   
    return (
      <div className="main--content">
        <Paper elevation={1} className="paper--profile" variant="elevation">
          <Grid container spacing={5}>
            <Grid item justify="center" alignContent="center">
              <Avatar src={user.profilPicture} className={classes.avatarProfile} />
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item container direction="column" alignItems="stretch" justify="center">
                <Grid item xs>
                  <Typography variant="h4">
                    {user.name}
                  </Typography>
               </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1" gutterBottom>
                        {user.posts?.length} Posts  |  {user.friends?.length} Friends
                  </Typography>
                  </Grid>


                <Grid item xs>
                  <Grid container spacing={2}
                    direction="row">
                    <Grid item >
                      {ViewFriends(user.friends)}

                    </Grid>
                    <Grid item>
                      {rqButton}
                    </Grid>


                  </Grid>

                </Grid>

              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  
  

  }







export function UserPosts(userid) {
  var feedUrl = "https://imagehub.azurewebsites.net/api/v2.0/Feed/user/" + userid;
  //var feed = FetchUrl(feedUrl);
  var feed = [{ title: "Post1", description: "Desc1", pictureUrl: "asdfad", likes: 10, uploader: { name: "adfads", id: "asdfa" } },
  { title: "Post1s", description: "Desc1s", pictureUrl: "asdfad", likes: 10, uploader: { name: "adfads", id: "asdfa" } }]
  return feed;
}

async function GetFriendRequests() {
  console.log("Function: GetFriendRequests");
  var url = "https://imagehub.azurewebsites.net/api/v2.0/User/friendrequests"
  var requests;
  try{
    requests = await FetchUrl(url);
    return requests;
  }
  catch(err){
    throw new Error("Couldn't load Friend requests because: \n" + err.message)
  }
  

  
}

export async function FetchUrl(url){
  const valasz = await fetch(url);
  
  if(!valasz.ok){
    if(valasz.status == 401)
      throw new Error('You are not logged in.');
    throw new Error('Unknown error (Something wrong with the network response).');
  }
  else{
    var ansf = valasz.json();
    return ansf;
  }
  
}

async function postData(url = '') {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
  });
  return response.json(); // parses JSON response into native JavaScript objects
}