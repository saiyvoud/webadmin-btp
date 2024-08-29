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
import { ProfilePicture } from "../views/userInfo/components/ProfilePicture";
import { FormEditBanner } from "../views/bannerManage/components/FormEditBanner";
import Authentication from "../components/Authentication";
import { Role } from "../constants";  // Ensure this import exists
import { AboutBanner } from "../views/aboutManagement/components/AboutBanner";
import { FormAddCompanyInfo } from "../views/aboutManagement/components/FormAddCompanyInfo";
import { FormAddCoverImg } from "../views/aboutManagement/components/FormAddCoverImg";
import { FormEditAbout } from "../views/aboutManagement/components/FormEditAbout";
import { ContactManagement } from "../views/contact/ContactManagement";
import { ContactDetail } from "../views/contact/components/ContactDetail";

export const RouterPaths = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <Dashboard />
                </Authentication>
            ),
        },
        {
            path: '/serviceManagement',
            element: <ServiceManagement />
        },
        {
            path: "/serviceManagement/formEditCard/:id",
            element: <FormEditService />
        },
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
            path: '/aboutManagement',
            element: <AboutManagement />
        },
        {
            path: '/aboutManagement/formAddImage',
            element: <FormAddImage />
        },
        {
            path: '/aboutManagement/formEditAbout/:id',
            element: <FormEditAbout />
        },
        {
            path: '/aboutManagement/aboutInfo/:id',
            element: <FormAboutInfo />
        },
        {
            path: '/aboutManagement/formAddCompanyInfo',
            element: <FormAddCompanyInfo />
        },
        {
            path: '/aboutManagement/aboutBanner',
            element: <AboutBanner />
        },
        {
            path: '/aboutManagement/addAboutBanner',
            element: <FormAddCoverImg />
        },
        {
            path: '/aboutManagement/aboutInfo/:id',  // corrected path
            element: <FormAboutInfo />
        },
        {
            path: '/contactManagement',
            element: <ContactManagement />
        },
        {
            path: '/contactManagement/contactDetail/:id',
            element: <ContactDetail />
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