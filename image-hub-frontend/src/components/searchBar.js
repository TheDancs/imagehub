import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { FetchUrl, postData, } from './profile';
import { ShowError, ShowInfo } from './alert';
import { Avatar, Paper, Typography } from '@material-ui/core';
import FriendRequestButton from "./friendRequestButton";
import List from '@material-ui/core/List';
import { Grid, Link } from "@material-ui/core";
import SearchResultCard from './ResultCards';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
    root: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: theme.palette.background.paper,
      },
}));



export default function SearchBar() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [search_result, setSearchResult] = useState([]);

    const url = "https://imagehub.azurewebsites.net/api/v2.0/User/search/";
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    var searchValue = "";
    var RESULT;

    const handleTypeing = (event) => {
        var search_bar = document.getElementById("search_bar");
        if (event.key === "Enter") {
            searchValue = search_bar.value;
            handleEnter(event);
        }
        else if(event.key === "Escape")
            handleFocusOut();
    };

    const handleEnter = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        GetSearchResult();
    };

    const handleFocusOut = () => {
        setAnchorEl(null);
    }

    async function GetSearchResult() {
        await FetchUrl(url + searchValue)
            .then(re => setSearchResult(re))
            .catch(err => setError(err))
            .finally(() => setIsLoaded(true));
    }
    if (!isLoaded) {
        RESULT = "loading";
    }
    else if (error || search_result.length === 0) {
        if (error) {
            RESULT = ShowError("Eroor", error.message);
        }
        else {
            RESULT = ShowInfo("Result", "No result for '" + searchValue + "'");
        }
    }
    else {
        RESULT = (
            <>
            <List dense className={classes.root}>
                {search_result.map((friend) => {
                    return (
                        
                        <div key={friend.id}>
                            <SearchResultCard user={friend}/>
                        </div>
                    );
                })
                }
                </List>
            </>
        );
    }

    return (
        <div>
            <Grid container justify="flex-end" alignItems="center" direction="row">
                <Grid item>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                </Grid>
                <Grid item>
                    <TextField onKeyUp={handleTypeing} autoComplete="off" id="search_bar" placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }} />
                </Grid>

            </Grid>
            <Popper id={id} open={open} anchorEl={anchorEl} >
                <Paper className={classes.paper} elevation={3} onBlur={handleFocusOut}>
                    {RESULT}
                    <Button variant="text" onClick={handleFocusOut}>Close</Button>
                </Paper>
            </Popper>
        </div>
    );
}
