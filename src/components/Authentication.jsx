import React from "react";
import { Navigate } from "react-router-dom";
import { isAllowedRole } from "../helpers";  // Ensure this import exists
import Swal from "sweetalert2";
import { Role } from "../constants";

const Authentication = ({ children, allowedRoles = [Role.admin] }) => {

    const isAuth = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }
        return true;
    }

    if (!isAuth()) {
        console.log("No token");
        return <Navigate to="/login" />;
    }

    if (!isAllowedRole(allowedRoles)) {

        console.log("No role");
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default Authentication;