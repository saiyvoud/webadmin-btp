import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "../views/dashboard/Dashboard";
import { ServiceManagement } from "../views/serviceManagement/ServiceManagement";
import { FormAddCard } from "../views/serviceManagement/components/FormAddCard";
import { ServiceInfo } from "../views/serviceInfo/ServiceInfo";
import { NewsManagement } from "../views/newsManagement/NewsManagement";
import { FormAddCardNews } from "../views/newsManagement/components/FormAddCardNews";
import { BannerManagement } from "../views/bannerManage/BannerManagement";
import { FormAddBanner } from "../views/bannerManage/components/FormAddBanner";
import { AboutManagement } from "../views/aboutManagement/AboutManagement";
import { FormAddImage } from "../views/aboutManagement/components/FormAddImage";
import { UserInfo } from "../views/userInfo/UserInfo";
import { FormAddUser } from "../views/userInfo/components/FormAddUser";
import { Login } from "../views/auth/login/Login";
import { FormEditService } from "../views/serviceManagement/components/FormEditService";
import { FormEditCardNews } from "../views/newsManagement/components/FormEditCardNews";
import { FormAboutInfo } from "../views/aboutManagement/components/FormAboutInfo";
import { AboutBanner } from "../views/aboutManagement/components/AboutBanner";
import { ProfilePicture } from "../views/userInfo/components/ProfilePicture";
import { FormEditBanner } from "../views/bannerManage/components/FormEditBanner";

export const RouterPaths = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Dashboard />
        },
        {
            path: '/serviceManagement',
            element: <ServiceManagement />
        },
        {
            path: "/serviceManagement/formEditCard/:id",
            element: <FormEditService />
        }
        ,
        {
            path: '/serviceManagement/formAddCard',
            element: <FormAddCard />
        },
        {
            path: '/service',
            element: <ServiceInfo />
        },
        {
            path: '/newsManagement',
            element: <NewsManagement />
        },
        {
            path: '/newsManagement/formAddCardNews',
            element: <FormAddCardNews />
        },
        {
            path: '/newsManagement/formEditCardNews/:id',
            element: <FormEditCardNews />
        },
        {
            path: '/bannerManagement',
            element: <BannerManagement />
        },
        {
            path: '/bannerManagement/formAddBanner',
            element: <FormAddBanner />
        },
        {
            path: '/bannerManagement/formEditBanner/:id',
            element: <FormEditBanner />
        },
        {
            path: '/aboutManangement',
            element: <AboutManagement />
        },
        {
            path: '/aboutManangement/formAddImage',
            element: <FormAddImage />
        },
        {
            path: '/aboutManangement/aboutBanner',
            element: <AboutBanner />
        },
        {
            path: '/aboutManangement/aboutInfo/:id',
            element: <FormAboutInfo />
        },
        {
            path: '/userInfo',
            element: <UserInfo />
        },
        {
            path: '/userInfo/formAddUser',
            element: <FormAddUser />
        },
        {
            path: '/userInfo/editProfile/:id',
            element: <ProfilePicture />
        },
        {
            path: '/login',
            element: <Login />
        }
    ])
    return <RouterProvider router={router}></RouterProvider>
}