import React, { useState, useRef } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { FaEye, FaEyeSlash, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { register } from '../../../api/auth';
import { decryptData } from '../../../helpers';

export const FormAddUser = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [fileImg, setFileImg] = useState()
    const [loading, setLoading] = useState(false)

    const encryptedRole = localStorage.getItem("role");
    const currentRole = decryptData(encryptedRole);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setFileImg(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!image) newErrors.image = 'ກະລຸນາອັບໂຫຼດຮູບພາບກ່ອນ!';
        if (!username.trim()) newErrors.username = 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ກ່ອນ!';
        if (!firstName.trim()) newErrors.firstName = 'ກະລຸນາປ້ອນຊື່ກ່ອນ!';
        if (!lastName.trim()) newErrors.lastName = 'ກະລຸນາປ້ອນນາມສະກຸນກ່ອນ!';
        if (!phoneNumber.trim()) newErrors.phoneNumber = 'ກະລຸນາປ້ອນເບີໂທລະສັບກ່ອນ!';
        if (!email.trim()) newErrors.email = 'ກະລຸນາປ້ອນອີເມວກ່ອນ!';
        if (!password.trim()) newErrors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ!';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleSaveData();
        } else {
            //console.log('Form has errors');
        }
    };

    const handleSaveData = async () => {
        Swal.fire({
            title: "ທ່ານຕ້ອງການບັນທຶກລາຍການນີ້ແມ່ນບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            cancelButtonText: 'ຍົກເລີກ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                const data = {
                    username,
                    email,
                    password,
                    file: fileImg,
                    firstName,
                    lastName,
                    phoneNumber,
                };
                if (!(currentRole === "superadmin")) {
                    Swal.fire({
                        icon: "error",
                        title: "ທ່ານບໍ່ມີສິດໃນການບັນທຶກ!",
                    })
                    setLoading(false)
                }
                else {
                    const response = await register(data);
                    if (response) {
                        Swal.fire({
                            title: "ບັນທຶກສຳເລັດ!",
                            icon: "success",
                        }).then(() => {
                            navigate('/userInfo');
                        });
                        setLastName(false)
                    } else {
                        Swal.fire({
                            title: "ບັນທຶກລົ້ມເຫລວ!",
                            text: "ມີບາງຢ່າງບໍ່ຖືກຕ້ອງ, ກະລຸນາລອງອີກຄັ້ງ.",
                            icon: "error",
                        });
                        setLoading(false)
                    }
                }
            }
        });
    };

    return (
        <Sidebar>
            <div className='my-14 flex items-center justify-center'>
                <div className='rounded-lg bg-white p-10 w-[600px]'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-y-7'>
                        {/* Image Upload */}
                        <div className="mb-6">
                            <div className='flex items-center justify-center h-[170px] w-[170px] bg-[#F1F5F9] rounded-full mx-auto'>
                                <div className="border-2 border-dashed border-gray-300 rounded-full h-[150px] w-[150px] mx-auto text-center p-2">
                                    {image ? (
                                        <div className='h-full w-full relative'>
                                            <img src={image} alt="Preview" className="w-full h-full object-cover rounded-full" />
                                            <div
                                                onClick={() => setImage(null)}
                                                className='bg-black/50 w-[20px] cursor-pointer h-[20px] flex items-center justify-center rounded-full absolute bottom-0 left-[50%] -translate-x-1/2'>
                                                <FaTrashAlt className='text-[12px] text-white' />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-center flex-col justify-center h-full w-full'>
                                            <IoCloudUploadOutline className='text-[34px]' />
                                            <p className="text-gray-500 text-[14px]">ອັບໂຫຼດຮູບພາບຂອງທ່ານ</p>
                                            <input
                                                type="file"
                                                ref={imageInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => imageInputRef.current.click()}
                                                className="mt-2 px-4 py-1 bg-[#01A7B1] text-white rounded-full text-[12px]"
                                            >
                                                upload
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.image && <p className="text-red-500 text-[12px] mt-1">{errors.image}</p>}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[12px] mb-1">Username *</label>
                                <input
                                    type="text"
                                    placeholder="ກະລຸນາຊື່ຜູ້ໃຊ້..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="p-2 border rounded-md h-[40px]"
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>
                        </div>
                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[12px] mb-1">ຊື່ *</label>
                                <input
                                    type="text"
                                    placeholder="ກະລຸນາປ້ອນຊື່..."
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="p-2 border rounded-md h-[40px]"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[12px] mb-1">ນາມສະກຸນ *</label>
                                <input
                                    type="text"
                                    placeholder="ກະລຸນາປ້ອນນາມສະກຸນ..."
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="p-2 border rounded-md h-[40px]"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[12px] mb-1">ເບີໂທລະສັບ *</label>
                                <input
                                    type="tel"
                                    placeholder="ກະລຸນາປ້ອນເບີໂທລະສັບ..."
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="p-2 border rounded-md h-[40px]"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[12px] mb-1">ອີເມວ *</label>
                                <input
                                    type="email"
                                    placeholder="ກະລຸນາປ້ອນອີເມວ..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-2 border rounded-md h-[40px]"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[12px] mb-1">ລະຫັດຜ່ານ *</label>
                            <div className='w-full flex items-center relative'>
                                <input
                                    type={`${showPassword ? 'text' : 'password'}`}
                                    placeholder="ກະລຸນາປ້ອນລະຫັດຜ່ານ..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-2 border rounded-md w-full h-[40px]"
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3'>
                                    {
                                        showPassword ? <FaRegEye className='text-[16px]' /> : <FaRegEyeSlash className='text-[16px]' />
                                    }
                                </div>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className='flex items-center justify-center mt-4'>
                            <button
                                type="submit"
                                className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full flex items-center justify-center"
                                disabled={loading}
                            >
                                {
                                    loading ? <p className=' flex items-center justify-center gap-x-3'>ກຳລັງບັນທຶກ <span className="loader"></span></p> : "ບັນທຶກ"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidebar>
    );
};
