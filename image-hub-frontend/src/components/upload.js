import React, { useContext, useState } from "react";
import UserDataContext from "../context/UserDataContext";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export function Upload() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(false);

  const userData = useContext(UserDataContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = function (e) {
    const form = new FormData();
    form.append("Title", title);
    form.append("Description", description);
    form.append("UploaderId", userData.userID);
    form.append("File", selectedFile);

    const response = axios({
      method: "post",
      url: "https://imagehub.azurewebsites.net/api/v1.0/Iage",
      data: form,
    })
      .then((data) => {
        setOpen(true);
        setResult(true);
      })
      .catch((error) => {
        setOpen(true);
      });

    e.preventDefault();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <div className="image-placeholder">
        <form onSubmit={handleSubmit}>
          <h1>File Upload</h1>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={result ? "success" : "error"}>
          {result ? "Successfully uploaded 🎉" : "Upload failed 😭"}
        </Alert>
      </Snackbar>
    </div>
  );
}
