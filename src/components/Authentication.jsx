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

        const expiresIn = parseInt(expireToken);
        const expiresTime = expiresIn * 1000;
        const currentTime = Date.now();
        const timeLeftInSecond = Math.max(0, (expiresTime - currentTime) / 1000);
        if (currentTime >= expiresTime) {
            localStorage.removeItem("token");
            localStorage.removeItem("expireToken");
            return false;
        }

        return true;
    };

    if (!isAuth()) {
        Swal.fire({
            title: "Session ໝົດອາຍຸ",
            text: "Session ໝົດອາຍຸ ກະລຸນາລ໋ອກອິນໃໝ່ອີກຄັ້ງ!.",
            icon: "warning",
            confirmButtonText: "OK"
        }).then(() => {
            navigate("/login");
        });
        return null
    }


    return <>{children}</>;
};

export default Authentication;
