import React, { useState } from "react";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useInterval } from "../utils/polling";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Popover from "@material-ui/core/Popover";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Link } from "react-router-dom";
import logo from "../assets/images/menu-logo.png";
import PublishIcon from "@material-ui/icons/Publish";
import DashboardIcon from "@material-ui/icons/Dashboard";

import { SearchResult } from "./modals";
import { AuthManager } from "../providers/authProvider";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: "60vh !important",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },

  inputRoot: {
    color: "inherit",
    paddingLeft: "25px",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  friendsReqRoot: {
    width: "100%",
    maxWidth: "40ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  secondaryAction: {
    // Add some space to avoid collision as `ListItemSecondaryAction`
    // is absolutely positioned.
    paddingRight: 48,
  },
}));

export const PrimarySearchAppBar = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [friendsAnchor, setFriendsAnchor] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isFriendMenuOpen = Boolean(friendsAnchor);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    AuthManager.logout();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handlerNotificationOpen = (event) => {
    setFriendsAnchor(event.currentTarget);
  };

  const handlerNotificationClose = (event) => {
    setFriendsAnchor(null);
  };

  const acceptFriendRequest = async (request) => {
    let user = await AuthManager.getUser();

    axios.defaults.headers.common["Authorization"] =
      "Bearer " + user.access_token;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

    await axios({
      method: "POST",
      url:
        "https://imagehub.azurewebsites.net/api/v2.0/friendrequest/accept/" +
        request.id,
      headers: {},
    });

    setFriendRequest(friendRequest.splice(request));
  };

  const rejectFriendRequest = async (request) => {
    let user = await AuthManager.getUser();
    
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + user.access_token;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

    await axios({
      method: "POST",
      url:
        "https://imagehub.azurewebsites.net/api/v2.0/friendrequest/reject/" +
        request.id,
      headers: {},
    })

    setFriendRequest(friendRequest.splice(request));
  };

  const ListItemWithWiderSecondaryAction = withStyles({
    secondaryAction: {
      paddingRight: 96,
    },
  })(ListItem);

  useInterval(() => {
    AuthManager.getUser().then((user) => {
      setProfilePicture(user.profile.picture);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + user.access_token;
      axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
      axios({
        method: "get",
        url: "https://imagehub.azurewebsites.net/api/v2.0/friendrequest/list",
        headers: {},
      })
        .then((data) => {
          if (data.status === 200) {
            setFriendRequest(data.data);
          }
        })
        .catch((error) => {});
    });
  }, 1000 * 10);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/profile">
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </Link>
      <Link to="#">
        <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
      </Link>
    </Menu>
  );

  const id = isFriendMenuOpen ? "friends-popover" : undefined;
  const renderFriendsRequestItems = () => {
    return friendRequest.map((el) => {
      return (
        <ListItemWithWiderSecondaryAction
          key={el.id}
          className={classes.secondaryAction}
          dense
        >
          <ListItemAvatar>
            <Avatar src={el.from.profilePictureUrl} className={classes.small} />
          </ListItemAvatar>
          <ListItemText primary={el.from.name + " barátnak jelölt"} />
          <ListItemSecondaryAction>
            <IconButton edge="end">
              <CheckCircleIcon onClick={() => acceptFriendRequest(el)} />
            </IconButton>
            <IconButton edge="end">
              <CancelIcon onClick={() => rejectFriendRequest(el)} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemWithWiderSecondaryAction>
      );
    });
  };

  const renderFriendsRequestList = (
    <Popover
      id={id}
      open={isFriendMenuOpen}
      keepMounted
      onClose={handlerNotificationClose}
      className={classes.root}
      anchorEl={friendsAnchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <List className={classes.root}>{renderFriendsRequestItems()}</List>
    </Popover>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={friendRequest.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar src={profilePicture} className={classes.small} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <div className={classes.title}>
            <Link to="/">
              <img src={logo} height="40px" alt="" />
            </Link>
          </div>
          <div className={classes.search}>
            <SearchResult />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Link to="/feed">
              <IconButton aria-label="" color="inherit">
                <DashboardIcon />
              </IconButton>
            </Link>
            <Link to="/upload">
              <IconButton aria-label="" color="inherit">
                <PublishIcon />
              </IconButton>
            </Link>
            <IconButton color="inherit">
              <Badge badgeContent={friendRequest.length} color="secondary">
                <NotificationsIcon onClick={handlerNotificationOpen} />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar src={profilePicture} className={classes.small} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderFriendsRequestList}
    </div>
  );
};
