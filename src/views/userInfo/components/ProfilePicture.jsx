// ProfilePicture Component
import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserOneApi, updateUserImage } from '../../../api/user';
import { Sidebar } from '../../../components/Sidebar';
import Swal from 'sweetalert2';
import { Loading } from '../../../components/Loading';

export const ProfilePicture = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileImg, setFileImg] = useState(null);
    const imageInputRef = useRef(null);
    const [userData, setUserData] = useState(null);

    const { id } = useParams();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getUserOneApi(id);
            if (!response) {
                throw new Error('No response from API');
            }
            setUserData(response);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: "ເກີດຂໍ້ຜິດພາດ",
                text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
            });
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setFileImg(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleSaveData(id);
        } else {
            console.log('Form has errors');
        }
    };

    const handleSaveData = async (id) => {
        Swal.fire({
            title: "ທ່ານຕ້ອງການບັນທຶກຂໍໍໍມູນນີ້ເລີຍບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຢຶນຢັນ",
            cancelButtonText: 'ຍົກເລີກ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = {
                    image: fileImg,
                    oldImage: userData?.profile || ''
                };

                try {
                    setLoading(true);
                    const response = await updateUserImage(id, data);
                    if (response) {
                        Swal.fire({
                            title: "ບັນທຶກສຳເລັດ!",
                            icon: "success"
                        }).then(() => {
                            navigate('/userInfo');
                        });
                    } else {
                        Swal.fire({
                            title: "Error ການບັນທຶກລົ້ມເຫຼວ",
                            icon: "error"
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "ບໍ່ສາມາດບັນທຶກຂໍໍໍມູນໄດ້",
                        icon: "error"
                    });
                    console.error('Error saving data:', error);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const validateForm = () => {
        // Implement validation logic if needed
        return true;
    };

    return (
        <Sidebar>
            <div className='my-14 flex items-center justify-center'>
                <div>
                    <div onClick={() => navigate(-1)}
                        className='cursor-pointer text-[#01A7B1] text-[16px] mb-5 flex items-center gap-x-3'>
                        <FaArrowLeft />
                        <h4>ກັບຄືນ</h4>
                    </div>
                    <div className='rounded-lg bg-white p-10 w-[600px]'>
                        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-y-7'>
                            <div className="border-2 border-dashed border-gray-300 rounded-full h-[300px] w-[300px] text-center p-2">
                                {image ? (
                                    <div className='w-full h-full relative'>
                                        <img src={image} alt="Preview" className="w-full h-full object-cover rounded-full" />
                                        <div onClick={() => setImage(null)}
                                            className='w-[25px] h-[25px] absolute top-1 left-1/2 -translate-x-1/2 cursor-pointer bg-black/55 rounded-lg flex items-center justify-center'>
                                            <FaTrashAlt className='text-white text-[14px]' />
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex items-center flex-col justify-center h-full w-full'>
                                        <FaCloudUploadAlt className="mx-auto text-gray-400 mb-2 text-[52px]" />
                                        <p className="text-gray-500 text-[14px]">ອັບໂຫຼດຮູບພາບ</p>
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
                                            className="mt-2 px-4 py-2 bg-[#01A7B1] text-white rounded-md"
                                        >
                                            Upload
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center justify-center'>
                                <button type="submit" className="w-[140px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full">
                                    {loading ?
                                        (
                                            <div className=' flex justify-center gap-x-2 items-center text-[14px]'>
                                                ກຳລັງແກ້ໄຂ <Loading />
                                            </div>
                                        )
                                        : "ແກ້ໄຂ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};