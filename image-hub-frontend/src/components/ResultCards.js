import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import FriendRequestButton from './friendRequestButton';
import { Button, Link } from "@material-ui/core";
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';


export default function SearchResultCard(props) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={props.user.profilePictureUrl} />
      </ListItemAvatar>
      <ListItemText primary={<Link color="inherit" variant="body1" href={"/Profile?" + props.user.id}> {props.user.name}</Link>} />
      <ListItemSecondaryAction>
        <FriendRequestButton userId={props.user.id} statusCode={props.user.friendStatus} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export function ListResultCard(props) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={props.user.profilePictureUrl} />
      </ListItemAvatar>
      <ListItemText primary={<Link color="inherit" variant="body1" href={"/Profile?" + props.user.id}> {props.user.name}</Link>} />
    </ListItem>
  );
}

export function FriendRequestResultCard(props){
  return(
<ListItem>
      <ListItemAvatar>
        <Avatar src={props.user.profilePictureUrl} />
      </ListItemAvatar>
      <ListItemText primary={<Link color="inherit" variant="body1" href={"/Profile?" + props.user.id}> {props.user.name}</Link>} />
      <ListItemSecondaryAction>
        <Button variant="outlined" onClick={()=> props.handle(props.reqId,true)}>
          Accept
        </Button>
        <Button variant="text" onClick={()=> props.handle(props.reqId,false)}>
          Reject
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export function LoadingResultCards(){
  return (
    <ListItem>
      <ListItemAvatar>
      <Skeleton variant="circle" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText primary={ <Skeleton variant="text" />} />
    </ListItem>
  );
}
