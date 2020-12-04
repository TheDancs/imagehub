import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Skeleton from "@material-ui/lab/Skeleton";

export default function CreatePost(post) {
  return (
    <Card maxWidth={450} marginBottom={15}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" backgroundColor={red[500]}>
            {post.title ? post.title.charAt(0) : "A"}
          </Avatar>
        }
        title={post.uploader.name}
      />
      <CardMedia height={0} paddingTop={"100.00%"} image={post.pictureUrl} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton aria-label="Likes">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="People who liked">{post.likes}</IconButton>
      </CardActions>
    </Card>
  );
}

export function LoadingPost() {
  return (
    <Card marginBottom={15}>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
        }
        action={null}
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      {
        <Skeleton
          animation="wave"
          variant="rect"
          width="100%"
          height={300}
          paddingTop={"100.00%"}
        />
      }

      <CardContent width={400}>
        {
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        }
      </CardContent>
    </Card>
  );
}
