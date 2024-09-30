import React, { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { isAllowedRole } from "../helpers";
import { Role } from "../constants";
import { formatUnixTimestamp } from "../views/utils";

const Authentication = ({ children, allowedRoles = [Role.admin, Role.superadmin] }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuth = () => {
        const token = localStorage.getItem("token");
        const expireToken = localStorage.getItem("expireToken");

        if (!token || !expireToken) {
            return false;
        }

        const expirationTime = formatUnixTimestamp(expireToken);
        const currentTime = Math.floor(Date.now() / 1000);
        const currentTimeFormat = formatUnixTimestamp(currentTime);

        console.log("currentTimeFormat", currentTimeFormat);

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
                    text: "Session ໝົດອາຍຸ ກະລຸນາລ໋ອກອິນໃໝ່ອີກຄັ້ງ!",
                    icon: "warning",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate("/login", { state: { from: location } });
                });
            }
        }, 60000);

        return () => clearInterval(authCheckInterval);
    }, [navigate, location]);

    // if (!isAuth()) {
    //     return <Navigate to="/" state={{ from: location }} replace />;
    // }

    // if (!isAllowedRole(allowedRoles)) {
    //     return <Navigate to="/" replace />;
    // }

    return <>{children}</>;
};

export default Authentication;