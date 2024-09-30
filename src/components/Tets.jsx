import React from 'react'
import { ROLE } from '../constant';
import { clearLocalStorage, getUserFromLocalStorage, isAllowedRole, isLogin } from '../helpers';
import { Navigate } from 'react-router-dom';

const Authentication = ({ children, allowedRoles = [ROLE.ADMIN] }) => {

    if (!isLogin()) {
        // clearLocalStorage();
        return <Navigate to="/login" />;
    }

    const user = getUserFromLocalStorage();
    const expiresIn = parseInt(user?.expiresIn);
    const expiresTime = expiresIn * 1000;
    const currentTime = Date.now();
    const timeLeftInSecond = Math.max(0, (expiresTime - currentTime) / 1000);

    const isTokenExpired = () => {
        return currentTime >= expiresTime;
    }

    if (isTokenExpired()) {
        clearLocalStorage();
        return <Navigate to="/login" />;
    }

    // if(!isAllowedRole(allowedRoles)){
    //     clearLocalStorage();
    //     return <Navigate to="/login"/>;
    //   }

    return <>{children}</>;
}

export default Authentication