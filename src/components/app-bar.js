import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from "@material-ui/core/Badge";
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import logo from "../assets/images/menu-logo.png";
import {Link} from "react-router-dom";
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function AppHeader() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>

                    <div className={classes.title}>
                        <Link to="/">
                            <img src={logo} height="40px" alt=""/>
                        </Link>
                    </div>

                    <div>
                        <Link to="/">
                            <IconButton aria-label="" color="inherit">
                                <HomeIcon/>
                            </IconButton>
                        </Link>

                        <Link to="/feed">
                            <IconButton aria-label="" color="inherit">
                                <DashboardIcon/>
                            </IconButton>
                        </Link>
                        <Link to="/upload">
                            <IconButton aria-label="" color="inherit">
                                <PublishIcon/>
                            </IconButton>
                        </Link>

                        <Link to="#">
                            <IconButton aria-label="" color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon/>
                                </Badge>
                            </IconButton>
                        </Link>

                        <Link to="#">
                            <IconButton edge="end" aria-label="" color="inherit">
                                <AccountCircle/>
                            </IconButton>
                        </Link>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}