import { createContext, useState } from "react";

const UserContext = createContext();

function UserContextProvider(props) {
    const [contextUsername, setContextUsername] = useState();
    const [contextEmail, setContextEmail] = useState();
    const [contextUserID, setContextUserID] = useState();

    return (
        <UserContext.Provider
            value={{
                contextUsername,
                setContextUsername,
                contextEmail,
                setContextEmail,
                contextUserID,
                setContextUserID
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}

export { UserContext, UserContextProvider };
