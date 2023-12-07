import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const getValueFor = async () => {
        console.log("Executing getValuedFor");

        let result = await SecureStore.getItemAsync("userData");
        if (result) {
            result = JSON.parse(result);
            setUser(result);
        };
    };

    useEffect(() => {
        getValueFor();
    }, []);

    const login = async (userData) => {
        setUser(userData);
        await SecureStore.setItemAsync("userData", JSON.stringify(userData));
    };


    const logout = async () => {
        setUser(null);
        await SecureStore.setItemAsync("userData", "");
    };

    const isAuthenticated = () => {
        return !!user;
    };

    // Do not use for now, later 
    return (
        <AuthContext.Provider
            value={{
                user, login, logout, isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };