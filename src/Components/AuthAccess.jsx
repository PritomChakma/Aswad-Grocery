import React from "react";
import { Navigate } from "react-router-dom";    
import { useAuth } from "../authen/auth";  
import Loading from "../Shared/Loading";


function ProtectedRoute({children}) {
    const {isAuthorized} = useAuth();

    if (isAuthorized === null) {
        return <Loading></Loading>
    }

    if (
        isAuthorized &&
        (window.location.pathname === "/login" || window.location.pathname === "/register")
    ) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;