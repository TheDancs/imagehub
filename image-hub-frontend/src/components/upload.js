import React, { useContext, useState } from "react";
import UserDataContext from "../context/UserDataContext";
import axios from "axios";

export function Upload() {
  const userData = useContext(UserDataContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const submitForm = () => {};

  const handleSubmit = function (e) {
    const form = new FormData();
    form.append("Title", title);
    form.append("Description", description);
    form.append("UploaderId ", userData.userID);
    form.append("File", selectedFile);

    const response = axios({
      method: "post",
      url: "https://localhost:5001/api/v1.0/Image",
      data: form,
      headers: {
        "content-type": 'multipart/form-data; boundary=${form._boundary}',
      },
    });
    e.preventDefault();
  };

  return (
    <div>
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
  );
}
