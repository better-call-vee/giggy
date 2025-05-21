import React, { useContext } from "react";
import AuthContext from "../provider/AuthContext";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/Loading";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    if (user?.email) {
        return children;
    }

    return (
        <Navigate
            to="/auth/login"
            replace
            state={{ from: location }}
        />
    );
};

export default PrivateRoute;
