import { createContext, useState } from "react";

const UserContext = createContext();

function UserContextProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authUsername, setAuthUsername] = useState();
    const [authEmail, setAuthEmail] = useState();
    const [authUserID, setAuthUserID] = useState();

    return (
        <UserContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                authUsername,
                setAuthUsername,
                authEmail,
                setAuthEmail,
                authUserID,
                setAuthUserID
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}

export { UserContext, UserContextProvider };
