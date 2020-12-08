import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { postData } from './profile';

export default function FrienRequestButton(args) {
    const[statusCode, setStatusCode] = useState(args.statusCode);
    const[label, setLabel] = useState("Wait");
    const[enabled, setEnabled] = useState(false);
    const[isLoaded, setIsLoaded] = useState(false);

    if(!isLoaded)
    {
        switch (statusCode) {
            case 0: setLabel("Add friend"); setEnabled(true); break;
            case 1: setLabel("Delete Friend"); setEnabled(true); break;
            default: setLabel("Request pending"); setEnabled(false); break;
        }
        setIsLoaded(true);
    }    
    return (
        <Button variant="outlined" disabled={!enabled} onClick={() => HandleButtonPress(statusCode, args.userId, setStatusCode, setIsLoaded)}>
            {label}
        </Button>
    );
}

function HandleButtonPress(sc, id, setStatus, setLoad) {
    if(sc === 0)
    {
        SendFriendRequest(id);
        setStatus(2);
    }        
    else if(sc === 1){
        Unfriend(id);
        setStatus(0);
    }
    setLoad(false);        
}

export async function Unfriend(id) {
    var url = "https://imagehub.azurewebsites.net/api/v2.0/User/"+id+"/unfriend";
    await postData(url);
  }

 export async function SendFriendRequest(id) {
    var url = "https://imagehub.azurewebsites.net/api/v2.0/FriendRequest/send/"+id;
    await postData(url);
  }