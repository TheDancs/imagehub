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
import CreatePerosnalPost, { LoadingPost,  } from "./post";


const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginbottom: '20px',
    paddingBottom: '40px'
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
  gridList: {
    width: '100%',
    height: '100%',
  },
}));


export function Profile(args) {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  
  var id;

  if (args.location.search === "")
    id = "me";
  else
    id = args.location.search.replace("?", "");

  //lekérjük az adott id-hez tartozó feedet
  if(!isLoaded)
  GetUserPosts(id)
  .then(re => setPosts(re))
  .catch(err => setError(err))
  .finally(()=>setIsLoaded(true));

  //ez html formátumban a feed, vagy ha nincs mit betölteni, akkor egy hibaüzenet.
  var POSTS;
  var PROFILESUMMARY = ProfileSummary(id);

  if(error || !posts || posts.length === 0)
  {
    POSTS = (<> <div margin="20px"> {ShowInfo("No posts to show", "This user has not upload any post yet.")}</div> </>);
  }
  else if(!isLoaded)
    POSTS = "Loading.";
  else
  POSTS = (
    <>
      <GridList cols={3.5} spacing={3} cellHeight={'100%'} className={classes.gridList}>
        {posts.map((post) => {
          return (
            <div className={classes.container} key={post.id}>
              <CreatePerosnalPost post={post} />
            </div>            
          );
        })}
      </GridList>
    </>
  );

  return (
    <Container>
      <div>
        {PROFILESUMMARY}
        <div className={classes.container}>
        {POSTS}
        </div>
        
      </div>
    </Container>
  );
}

export function ProfileSummary(user_id) {
  const url = "https://imagehub.azurewebsites.net/api/v2.0/User/" + user_id;

  const classes = useStyles();

  const [userSummary, setUserSummary] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [myId, setMyId] = useState(null);

  if(myId == null)
  AuthManager.getUser().then(i => setMyId(i.profile.sub)).catch(er => setError(er))

  var rqButton;

  //Ha a saját profilunk kell.
  if (user_id === "me" || user_id === myId) {
    rqButton = (<><FriendRequests /></>);
  }
  else {
    if (userSummary != null) {
      //Ha a barátunk
      if (userSummary.isFriend) {
        rqButton = (<Button onClick={() => Unfriend()} >Delete friend</Button>);
      }
      //ha nem a barátunk
      else {
        rqButton = (<Button onClick={() => SendFriendRequest()} >Send Friendrequest</Button>);
      }
    }
  }
    //Ha még nem próbáltuk betölteni
    if (!isLoaded)
      FetchUrl(url)
        .then(res => setUserSummary(res))
        .catch(err => setError(err))
        .finally(() => setIsLoaded(true));

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
    else if (!isLoaded) {
      //Talán később egy skeletont csinálhatnánk hozzá
    }
    //Ha betöltöttük 
    else {
      return (
        <div className="main--content">
          <Paper elevation={1} className="paper--profile" variant="elevation">
            <Grid container spacing={5} justify="center" alignContent="center">
              <Grid item >
                <Avatar src={userSummary.profilePictureUrl} className={classes.avatarProfile} />
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
                      {userSummary.numberOfPosts} Posts  |  {userSummary.numberOfFriends} Friends
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
 export async function Unfriend(id) {
    var url = "https://imagehub.azurewebsites.net/api/v2.0/User/"+id+"/unfriend";
    await postData(url);
  }

 export async function SendFriendRequest(id) {
    var url = "https://imagehub.azurewebsites.net/api/v2.0/FriendRequest/send/"+id;
    await postData(url);
  }

  export function GetUserPosts(userid) {
    var feedUrl = "https://imagehub.azurewebsites.net/api/v2.0/Feed/user/" + userid;
    var feed = FetchUrl(feedUrl).catch(err => console.log(err));
    return feed;
  }


  export async function FetchUrl(url) {
    const user = await AuthManager.getUser();

    const respon = await fetch(url, { headers: { 'Authorization': "Bearer " + user.access_token } });

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
      headers: { 'Authorization': "Bearer " + token },   
    });
    return response.status; // parses JSON response into native JavaScript objects
  }