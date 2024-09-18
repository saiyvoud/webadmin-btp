import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAllowedRole } from "../helpers";  // Ensure this import exists
import Swal from "sweetalert2";
import { Role } from "../constants";

const Authentication = ({ children, allowedRoles = [Role.admin, Role.superadmin] }) => {
    const navigate = useNavigate();

    const isAuth = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }

        // Check token expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
            // Token has expired
            localStorage.removeItem("token");
            Swal.fire({
                title: "Session ໝົດອາຍຸ",
                text: "Session ໝົດອາຍຸ ກະລຸນາລ໋ອກອິນໃໝ່ອີກຄັ້ງ!.",
                icon: "warning",
                confirmButtonText: "OK"
            }).then(() => {
                navigate("/login");
            });
            return false;
        }

        return true;
    }

    useEffect(() => {
        // Check authentication status periodically
        const authCheckInterval = setInterval(() => {
            if (!isAuth()) {
                clearInterval(authCheckInterval);
            }
        }, 60000); // Check every minute

        return () => clearInterval(authCheckInterval);
    }, []);

    if (!isAuth()) {
        //console.log("No token or token expired");
        return <Navigate to="/login" />;
    }

    if (!isAllowedRole(allowedRoles)) {
        //console.log("No role");
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default Authentication;