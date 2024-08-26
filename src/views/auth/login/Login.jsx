import React, { useState } from 'react';
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import logo from '../../../assets/images/webp/logo.webp';
import bgAuth from '../../../assets/images/webp/bgLogin.webp';
import { LoginApi } from '../../../api/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

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
                // console.log('Submitting login with:', username, password);
                const response = await LoginApi(username, password);

                if (response) {
                    navigate('/');
                    Swal.fire({
                        title: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
                        // text: "Logged in successfully",
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
                            ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜໍ່າເພື່ອເຂົ້າສູ່ລະບົບ
                        </p>
                    </div>
                    <div className='w-full'>
                        <Card color="transparent" shadow={false}>
                            <form className="mt-8 mb-2 w-full" onSubmit={handleSubmit}>
                                <div className="mb-1 flex flex-col gap-6">
                                    <div className='relative input-container'>
                                        <Input
                                            color="teal"
                                            size='lg'
                                            label="Username"
                                            className={`h-[40px] ${username ? 'input-not-empty' : ''}`}
                                            style={{ fontSize: '14px' }}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        {errors.username && (
                                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                        )}
                                    </div>
                                    <div className='relative input-container'>
                                        <Input
                                            color="teal"
                                            size='lg'
                                            type='password'
                                            label="Password"
                                            className={`h-[40px] ${password ? 'input-not-empty' : ''}`}
                                            style={{ fontSize: '14px' }}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
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
                                            className="flex items-center font-normal"
                                        >
                                            ຈື່ຂ້ອຍ
                                        </Typography>
                                    }
                                    containerProps={{ className: "-ml-2.5" }}
                                />
                                <Button
                                    type="submit"
                                    className="mt-6 bg-[#01A7B1] h-[40px] font-medium text-[16px]"
                                    fullWidth
                                    disabled={loading} // Disable button when loading
                                >
                                    ລ໋ອກອິນ
                                </Button>
                                <Typography color="gray" className="mt-6 text-center font-normal">
                                    ຍັງທີ່ບໍ່ມີບັນຊີແມ່ນບໍ່?{" "}
                                    <a href="#" className="font-medium text-gray-900">
                                        ລົງທະບຽນ
                                    </a>
                                </Typography>
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
