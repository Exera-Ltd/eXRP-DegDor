import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const value = { user, setUser };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};