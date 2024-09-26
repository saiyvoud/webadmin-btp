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
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <ServiceManagement />
                </Authentication>
            )
        },
        {
            path: "/serviceManagement/formEditCard/:id",
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormEditService />
                </Authentication>
            )
        },
        {
            path: '/serviceManagement/formAddCard',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAddCard />
                </Authentication>
            )
        },
        {
            path: '/service',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <ServiceInfo />
                </Authentication>
            )
        },
        {
            path: '/newsManagement',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <NewsManagement />
                </Authentication>
            )
        },
        {
            path: '/newsManagement/formAddCardNews',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAddCardNews />
                </Authentication>
            )
        },
        {
            path: '/newsManagement/formEditCardNews/:id',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormEditCardNews />
                </Authentication>
            )
        },
        {
            path: '/bannerManagement',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <BannerManagement />
                </Authentication>
            )
        },
        {
            path: '/bannerManagement/formAddBanner',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAddBanner />
                </Authentication>
            )
        },
        {
            path: '/bannerManagement/formEditBanner/:id',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormEditBanner />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <AboutManagement />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement/formAddImage',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAddImage />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement/formEditAbout/:id',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormEditAbout />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement/aboutInfo/:id',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAboutInfo />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement/formAddCompanyInfo',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAddCompanyInfo />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement/aboutBanner',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <AboutBanner />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement/addAboutBanner',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAddCoverImg />
                </Authentication>
            )
        },
        {
            path: '/aboutManagement/aboutInfo/:id',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAboutInfo />
                </Authentication>
            )
        },
        {
            path: '/contactManagement',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <ContactManagement />
                </Authentication>
            )
        },
        {
            path: '/contactManagement/contactDetail/:id',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <ContactDetail />
                </Authentication>
            )
        },
        {
            path: '/userInfo',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <UserInfo />
                </Authentication>
            )
        },
        {
            path: '/userInfo/formAddUser',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <FormAddUser />
                </Authentication>
            )
        },
        {
            path: '/userInfo/editProfile/:id',
            element: (
                <Authentication allowedRoles={[Role.admin, Role.superadmin]}>
                    <ProfilePicture />
                </Authentication>
            )
        },
        {
            path: '/login',
            element: <Login />
        }
    ])
    return <RouterProvider router={router}></RouterProvider>
}