import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { isAllowedRole } from "../helpers"; // Ensure this import exists
import { Role } from "../constants";
import { formatDate, formatUnixTimestamp } from "../views/utils";

const Authentication = ({ children, allowedRoles = [Role.admin, Role.superadmin] }) => {
    const navigate = useNavigate();

    const isAuth = () => {
        const token = localStorage.getItem("token");
        const expireToken = localStorage.getItem("expireToken");

        if (!token || !expireToken) {
            return false;
        }

        const expirationTime = formatUnixTimestamp(expireToken);
        // console.log("expirationTime", expirationTime);
        const currentTime = Math.floor(Date.now() / 1000);
        const currentTimeFormat = formatUnixTimestamp(currentTime);
        // const aT = '28/09/2567 06:11:18'
        console.log("currentTimeFormat", currentTimeFormat);
        // console.log("aT >= expirationTime", aT >= expirationTime);
        // console.log("currentTime > expirationTime", currentTimeFormat >= expirationTime);
        if (currentTimeFormat >= expirationTime) {
            localStorage.removeItem("token");
            localStorage.removeItem("expireToken");
            return false;
        }

        return true;
    };

    useEffect(() => {
        const authCheckInterval = setInterval(() => {
            if (!isAuth()) {
                clearInterval(authCheckInterval);
                Swal.fire({
                    title: "Session ໝົດອາຍຸ",
                    text: "Session ໝົດອາຍຸ ກະລຸນາລ໋ອກອິນໃໝ່ອີກຄັ້ງ!.",
                    icon: "warning",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate("/login");
                });
            }
        }, 60000);

        return () => clearInterval(authCheckInterval);
    }, [navigate]);
    if (!isAuth()) {
        return <Navigate to="/login" />;
    }

    if (!isAllowedRole(allowedRoles)) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default Authentication;
