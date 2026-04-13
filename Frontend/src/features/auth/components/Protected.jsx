import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

import React from 'react'

const Protected = ({children}) => {
    const {user,loading} = useAuth()
    if(loading){
        return <div><h1>Loading...</h1></div>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    return children
}

export default Protected