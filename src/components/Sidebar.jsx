import React from 'react'
import { Navbar } from './Navbar';

// images
import logo from '../assets/images/webp/logo.webp'

// icons
import { IoHomeOutline } from "react-icons/io5";
import { RiServiceLine } from "react-icons/ri";
import { LuFolderEdit } from "react-icons/lu";
import { IoNewspaperOutline } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { HiOutlineChatAlt } from "react-icons/hi";
import { MdManageAccounts } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { NavLink, useLocation } from 'react-router-dom';

export const Sidebar = ({ children }) => {
    const activeLink = 'text-white bg-[#01A7B1] gap-x-4 rounded-lg flex items-center py-3 px-8'

    const sidebarList = [
        {
            id: 1,
            title: 'Dashboard',
            icon: <IoHomeOutline className='text-[24px]' />,
            path: '/'
        },
        {
            id: 2,
            title: 'ຈັດການຂໍ້ມູນບໍລິການ',
            icon: <RiServiceLine className='text-[24px]' />,
            path: '/serviceManagement'
        },
        {
            id: 3,
            title: 'ປະເພດບໍລິການ',
            icon: <LuFolderEdit className='text-[24px]' />,
            path: '/service'
        },
        {
            id: 4,
            title: 'ຈັດການຂໍ້ມູນຂ່າວສານ',
            icon: <IoNewspaperOutline className='text-[24px]' />,
            path: '/newsManagement'
        },
        {
            id: 5,
            title: 'ຈັດການຂໍ້ມູນBanner',
            icon: <BsInfoCircle className='text-[24px]' />,
            path: '/bannerManagement'
        },
        {
            id: 6,
            title: 'ຈັດການຂໍ້ມູນກ່ຽວກັບເຮົາ',
            icon: <HiOutlineChatAlt className='text-[24px]' />,
            path: '/aboutManangement'
        },
        {
            id: 7,
            title: 'ຂໍ້ມູນຜູ້ໃຊ້ລະບົບ',
            icon: <MdManageAccounts className='text-[24px]' />,
            path: '/userInfo'
        },
        {
            id: 8,
            title: 'ອອກຈາກລະບົບ',
            icon: <RiLogoutCircleRLine className='text-[24px]' />,
            path: '/login'
        }
    ]

    const pathname = "/" + useLocation().pathname.split("/")[1];
    const isActivePath = (path) => { return pathname === path };

    return (
        <div className='flex h-screen overflow-hidden p-8'>
            <div className='w-[280px] h-full bg-white rounded-l-lg p-4 overflow-y-auto'>
                <div className='flex justify-center items-center gap-x-3 bg-[#D1FAE5] rounded-lg py-2.5'>
                    <img src={logo} alt="" className='w-16' />
                    <p className='text-[14px]'>
                        ບີທີພີ ທືນການສຶກສາຕ່າງປະເທດ
                    </p>
                </div>
                <div className='flex flex-col gap-y-5 mt-10'>
                    {sidebarList.map((item, index) => (
                        <NavLink key={index}
                            to={item.path}
                            className={`${isActivePath(item.path) ? activeLink :
                                'flex items-center gap-x-4 text-[#01A7B1] px-8 py-3 rounded-lg hover:bg-[#01A7B1] hover:text-white duration-300'}`
                            }
                        >
                            {item.icon}
                            <h4 className='text-[18px]'>
                                {item.title}
                            </h4>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <Navbar />
                <main className='flex-1 overflow-y-auto p-5 px-10'>
                    {children}
                </main>
            </div>
        </div>
    )
}