import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import FriendRequestButton from './friendRequestButton';
import { Grid, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
  },
}));

//user
export default function SearchResultCard(props) {
  const classes = useStyles();
  return (
        <ListItem>
            <ListItemAvatar>
              <Avatar src={props.user.profilePictureUrl}/>
            </ListItemAvatar>
            <ListItemText primary={<Link color="inherit" variant="body1" href={"/Profile?" + props.user.id}> {props.user.name}</Link>} />
            <ListItemSecondaryAction>
                <FriendRequestButton userId={props.user.id} statusCode={props.user.friendStatus} />
            </ListItemSecondaryAction>
          </ListItem>          
  );
}
