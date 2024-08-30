import React, { useState, useEffect } from 'react';
import {
    Card,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import logo from '../../../assets/images/webp/logo.webp';
import bgAuth from '../../../assets/images/webp/bgLogin.webp';
import { LoginApi } from '../../../api/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Load saved username from localStorage if it exists
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername) {
            setUsername(savedUsername);
        }
        if (savedPassword) {
            setUsername(savedPassword);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateForm = () => {
        const newErrors = { username: '', password: '' };
        let isValid = true;

        if (!username) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading

        if (validateForm()) {
            try {
                const response = await LoginApi(username, password); // Encrypt password before sending if necessary

                if (response) {
                    if (rememberMe) {
                        localStorage.setItem('username', username); // Save username
                    } else {
                        localStorage.removeItem('username'); // Clear saved username if not remembering
                    }
                    navigate('/');
                    Swal.fire({
                        title: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "ເກີດຂໍ້ຜິດພາດ",
                        text: "username ຫຼື password ບໍ່ຖືກຕ້ອງ",
                        icon: "error"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "An unexpected error occurred",
                    icon: "error"
                });
            }
        }
        setLoading(false); // End loading
    };

    return (
        <div className='w-full bg-white h-screen grid grid-cols-12'>
            <div className='col-span-6 w-full max-w-[550px] mx-auto py-20 px-10'>
                <div className='flex flex-col gap-y-16'>
                    <div className='flex items-center gap-x-5'>
                        <img src={logo} alt="Logo" className='w-16' />
                        <p className='text-[16px]'>
                            ບີທີພີ ທືນຮຽນຕໍ່ຕ່າງປະເທດ
                        </p>
                    </div>
                    <div>
                        <h2 className='text-[#01A7B1] font-medium text-[20px]'>
                            Login
                        </h2>
                        <p className='text-[14px]'>
                            ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານເພື່ອເຂົ້າສູ່ລະບົບ
                        </p>
                    </div>
                    <div className='w-full'>
                        <Card color="transparent" shadow={false}>
                            <form className="mt-8 mb-2 w-full" onSubmit={handleSubmit}>
                                <div className="mb-1 flex flex-col gap-6">
                                    <div className='relative'>
                                        <label htmlFor="username" className='block mb-2 text-[14px] font-medium text-gray-900'>Username</label>
                                        <input
                                            id="username"
                                            type="text"
                                            className='border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5'
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        {errors.username && (
                                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                        )}
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="password" className='block mb-2 text-[14px] font-medium text-gray-900'>Password</label>
                                        <input
                                            id="password"
                                            type={passwordVisible ? "text" : "password"}
                                            className='border border-gray-300 passwordInput text-gray-900 text-[14px] rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span
                                            className="absolute right-4 top-12 cursor-pointer"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordVisible ? <FaEyeSlash className=' text-[20px]' /> : <FaEye className=' text-[20px]' />}
                                        </span>
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                </div>
                                <Checkbox
                                    color='teal'
                                    label={
                                        <Typography
                                            variant="small"
                                            color="teal"
                                            className="flex text-[12px] items-center font-normal"
                                        >
                                            ຈື່ຂ້ອຍ
                                        </Typography>
                                    }
                                    containerProps={{ className: "-ml-2.5" }}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <Button
                                    type="submit"
                                    className="mt-6 bg-[#01A7B1] h-[40px] font-medium text-[16px]"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {
                                        loading ? <p className=' flex items-center justify-center gap-x-3'>ກຳລັງລ໋ອກອິນ <span className="loader"></span></p> : "ລ໋ອກອິນ"
                                    }
                                </Button>
                                {/* <Typography color="gray" className="mt-6 text-center font-normal">
                                    ຍັງທີ່ບໍ່ມີບັນຊີແມ່ນບໍ່?{" "}
                                    <a href="#" className="font-medium underline text-gray-900">
                                        ລົງທະບຽນ
                                    </a>
                                </Typography> */}
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
            <div className='col-span-6 h-full w-full flex justify-end relative z-20'>
                <div className='h-screen w-full'>
                    <img src={bgAuth} alt="Background" className='h-full w-full object-cover' />
                    <div className='text-white absolute z-50 top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2'>
                        <h4 className='text-[28px] font-medium tracking-wider'>
                            ຍິນດີຕ້ອນຮັບ
                        </h4>
                        <p className='text-[14px]'>
                            ເຂົ້າສູ່ລະບົບຂອງ ບີທີພີ ທືນຮຽນຕໍ່ຕ່າງປະເທດ
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
