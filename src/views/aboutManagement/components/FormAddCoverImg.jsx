import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { addCoverImageApi, getCoverImageApi, updateCoverImageApi } from '../../../api/about';
import { Sidebar } from '../../../components/Sidebar';
import Swal from 'sweetalert2';
import { Loading } from '../../../components/Loading';

export const FormAddCoverImg = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); // Default to false
    const [fileImg, setFileImg] = useState(null);
    const imageInputRef = useRef(null);
    const [coverImg, setCoverImg] = useState([]);

    // const imgID = coverImg.id
    // console.log("this is imgID=",);
    // console.log(imgID);

    const fetchData = async () => {
        // setLoading(true);
        try {
            const response = await getCoverImageApi();
            setCoverImg(response);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: "ເກີດຂໍ້ຜິດພາດ",
                text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
            });
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    };

    useEffect(() => {
        fetchData();
        console.log("this is data in cover img", coverImg);
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
            handleSaveData();
        } else {
            console.log('Form has errors');
        }
    };

    const handleSaveData = async () => {
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
                    // oldImg: coverImg.image
                };

                // console.log("this is old img", coverImg[0].image);

                try {
                    setLoading(true); // Set loading to true when saving data
                    const response = await addCoverImageApi(data);
                    if (response) {
                        Swal.fire({
                            title: "ບັນທຶກສຳເລັດ!",
                            icon: "success"
                        }).then(() => {
                            navigate('/aboutManagement');
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
                    setLoading(false); // Set loading to false after saving data
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
                        <form onSubmit={handleSubmit} className='flex flex-col gap-y-7'>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-[300px] w-full text-center p-2">
                                {image ? (
                                    <div className='w-full h-full relative'>
                                        <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                        <div onClick={() => setImage(null)}
                                            className='w-[25px] h-[25px] absolute top-1 right-1 bg-black/55 rounded-lg cursor-pointer flex items-center justify-center'>
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
                                <button type="submit" className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full">
                                    {loading ?
                                        <div className=' flex items-center justify-center gap-x-2'>
                                            <span>ກຳລັງບັນທຶກ</span><Loading />
                                        </div>
                                        :
                                        image ? "ບັນທຶກ" : "ແກ້ໄຂ"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};
