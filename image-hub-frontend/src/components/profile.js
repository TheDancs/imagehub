import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import RecipeReviewCard from "./post";
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import { FriendRequests, ViewFriends } from "./modals";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { ShowError, ShowInfo } from "./alert";
import { AuthManager } from "../providers/authProvider";


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


export function Profile(id) {
  //ez nem tudom miért kell, de enélkül nem működik
  if (typeof id != typeof string)
    id = "me";

  //lekérjük az adott id-hez tartozó feedet
  var posts = GetUserPosts(id);

  //ez html formátumban a feed, vagy ha nincs mit betölteni, akkor egy hibaüzenet.
  var POSTS;

  if (posts != null && posts.length > 0)
    POSTS = (
      <>
        <GridList cols="3" width="800">
          {posts.map((post) => {
            return (
              RecipeReviewCard(post)
            );
          })}
        </GridList>
      </>
    );

  else
    POSTS = (<> <div margin="20px"> {ShowInfo("No posts to show", "This user has not upload any post yet.")}</div> </>);

  return (
    <Container>
      <div>
        {ProfileSummary(id)}
        {POSTS}
      </div>
    </Container>
  );
}

export function ProfileSummary(user_id) {
  const url = "";

  const classes = useStyles();

  const [userSummary, setUserSummary] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  var rqButton;

  //Ha a saját profilunk kell.
  if (user_id === "me") {
    if(!isLoaded)
//@TODO: Erre kell vlami ami mindenféle adatot tartalmaz magunkról minimum név,kép,hánybarát,poszt,ill a barátoknak jelölés lista.
      AuthManager.getUser()
        .then(us => setUserSummary(us))
        .catch(err => setError(err))
        .finally(setIsLoaded(true));
    else if(userSummary != null)
      rqButton = (<><FriendRequests requs={userSummary.friendRequests}/></>);
  }
  else {
    //Ha még nem próbáltuk betölteni
    if (!isLoaded)
      FetchUrl(url)
        .then(res => setUserSummary(res))
        .catch(err => setError(err))
        .finally(() => setIsLoaded(true));
    //Ha már be van töltve, és sikeresen
    else if (userSummary != null) {
      //Ha a barátunk
      if (userSummary.isFriend) {
        rqButton = (<Button onClick={Unfriend()} >Delete friend</Button>);
      }
      //ha nem a barátunk
      else {
        rqButton = (<Button onClick={SendFriendRequest()} >Send Friendrequest</Button>);
      }
    }
  }
  
  //Ha valami hiba van, és nem sikerült a profilt betölteni.
  if (error || userSummary == null) {
    return (
      <div className="main--content">
        <div className={classes.container}>
          {ShowError("Something went wrong", error?.message)}
        </div>
      </div>
    );
  }
  else if(!isLoaded){
    //Talán később egy skeletont csinálhatnánk hozzá
  }
  //Ha betöltöttük 
  else {
    return (
      <div className="main--content">
        <Paper elevation={1} className="paper--profile" variant="elevation">
          <Grid container spacing={5} justify="center" alignContent="center">
            <Grid item >
              <Avatar src={userSummary.profilPicture} className={classes.avatarProfile} />
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item container direction="column" alignItems="stretch" justify="center">
                <Grid item xs>
                  <Typography variant="h4">
                    {userSummary.name}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1" gutterBottom>
                    {userSummary.posts} Posts  |  {userSummary.friends} Friends
                  </Typography>
                </Grid>


                <Grid item xs>
                  <Grid container spacing={2}
                    direction="row">
                    <Grid item >
                      <ViewFriends friendsList={userSummary.id} />
                      
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


}

//@TODO: Ezeket a linkeket megírni.
async function Unfriend(id){
  var url = "";
  await postData(url);
}

async function SendFriendRequest(id){
  var url = "";
  await postData(url);
}

export function GetUserPosts(userid) {
  var feedUrl = "https://imagehub.azurewebsites.net/api/v2.0/Feed/user/" + userid;
  var feed = FetchUrl(feedUrl).catch(err => console.log(err));
  return feed;
}


export async function FetchUrl(url) {
  var token;

  await AuthManager.getUser().then(user => token = user.access_token)

  const respon = await fetch(url, { headers: { 'Authorization': "Bearer " + token } });

  if (!respon.ok) {
    if (respon.status === 401)
      throw new Error('You are not logged in.');
    throw new Error('Unknown error (Something wrong with the network response).');
  }
  else {
    var ansf = respon.json();
    return ansf;
  }
}

export async function postData(url) {
  var token;
  await AuthManager.getUser().then(user => token = user.access_token)

  const response = await fetch(url, {
    method: 'POST',
    headers:{'Authorization': "Bearer " + token }
  });
  return response.json(); // parses JSON response into native JavaScript objects
}