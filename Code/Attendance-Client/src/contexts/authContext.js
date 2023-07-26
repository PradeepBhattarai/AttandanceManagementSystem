import React, {useState, createContext} from 'react';

export const AuthContext = createContext();

export const AuthProvider =(props)=>{

    const [authenticated, setAuthenticated]= useState(false);

    return (
        <AuthContext.Provider value={[authenticated, setAuthenticated]}>
         {props.children}   
        </AuthContext.Provider>
    )
}