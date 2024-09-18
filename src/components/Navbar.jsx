import React from 'react'

// images
// import profile from '../assets/images/webp/profile.webp'


// icons
import { IoIosSearch } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";

export const Navbar = () => {
    const profile = localStorage.getItem("profile")
    const fistName = localStorage.getItem("firstName")
    const lastName = localStorage.getItem("lastName")
    // //console.log("profile", profile);
    return (
        <div className='px-10 w-full flex items-center justify-end bg-[#f1f5f9] pb-4
        shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]
        '>
            {/* <div className=' relative flex items-center'>
                <input type="text"
                    className=' rounded-lg outline-none w-[350px] h-[40px] text-[14px] py-2.5 border-2 border-[#01A7B1] placeholder:font-medium pl-12'
                    placeholder='ຄົ້ນຫາ...'
                />
                <IoIosSearch className=' absolute left-2 text-[24px] text-[#00BAAF]' />
            </div> */}
            <div className=' flex items-center gap-x-10'>
                <div className=' bg-[#01A7B1] hidden w-[45px] h-[45px]  items-center justify-center rounded-full'>
                    <IoMdNotifications className=' text-[28px] text-[#F9C23C]' />
                </div>
                <div className=' flex items-center gap-x-4'>
                    <img src={`https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${profile}`} alt=""
                        className=' rounded-full object-cover w-[45px] h-[45px]'
                    />
                    <p className=' text-[14px]'>
                        {fistName} {lastName}
                    </p>
                </div>
            </div>
        </div>
    )
}
