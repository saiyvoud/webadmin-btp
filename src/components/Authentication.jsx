import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { isAllowedRole } from "../helpers"; // Ensure this import exists
import { Role } from "../constants";

const Authentication = ({ children, allowedRoles = [Role.admin, Role.superadmin] }) => {
    const navigate = useNavigate();

    const isAuth = () => {
        const token = localStorage.getItem("token");
        const expireToken = localStorage.getItem("expireToken");

        if (!token || !expireToken) {
            return false; // ไม่มี token หรือ expireToken
        }

        // เปรียบเทียบเวลา expiration กับเวลาปัจจุบัน
        const expirationTime = new Date(expireToken).getTime(); // assume expireToken is a date string
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
            // Token หมดอายุ
            localStorage.removeItem("token");
            localStorage.removeItem("expireToken");
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
    };

    useEffect(() => {
        // เช็คสถานะการ authentication เป็นระยะๆ
        const authCheckInterval = setInterval(() => {
            if (!isAuth()) {
                clearInterval(authCheckInterval); // หยุดการเช็คเมื่อหมดอายุ
            }
        }, 60000); // เช็คทุก 1 นาที

        return () => clearInterval(authCheckInterval);
    }, []);

    if (!isAuth()) {
        return <Navigate to="/login" />;
    }

    if (!isAllowedRole(allowedRoles)) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default Authentication;
