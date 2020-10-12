import React, {useContext} from "react";
import UserDataContext from "../context/UserDataContext";

export function MainContent() {
    const userData = useContext(UserDataContext);

    return (
        <div>
            <p className="main--content">Barátok: {userData.friend}!</p>
        </div>

    )
}