import React, { useState, useRef } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Select } from 'antd';
import { FaArrowLeft } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addBannerApi } from '../../../api/banner';

export const FormAddBanner = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('');
    const [detail, setDetail] = useState('');
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [fileImg, setFileImg] = useState()
    const [loading, setLoading] = useState()

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        setFileImg(file)
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!image) newErrors.image = 'ກະລຸນາອັບໂຫຼດຮູບພາບກ່ອນ!';
        if (!title.trim()) newErrors.title = 'ກະລຸນາປ້ອນຫົວຂໍ້ກ່ອນ!';
        if (!detail.trim()) newErrors.detail = 'ກະລຸນາປ້ອນລາຍລະອຽດກ່ອນ!';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleSaveData();
        } else {
            console.log('Form has errors');
        }
    };

    const handleSaveData = () => {
        const data = {
            title: title,
            detail: detail,
            image: fileImg,
            file: file
        }
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
                setLoading(true);
                try {
                    const response = await addBannerApi(data)
                    if (response) {
                        Swal.fire({
                            title: "ບັນທຶກສຳເລັດ!",
                            text: "ລາຍການ Banner ຖືກເພີ່ມແລ້ວ",
                            icon: "success"
                        });
                        navigate('/bannerManagement')
                    } else {
                        Swal.fire({
                            title: "ເກີດຂໍ້ຜິດພາດ!",
                            text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້",
                            icon: "error"
                        });
                    }
                } catch (error) {
                    setIsLoading(false);
                    console.error("Error saving news:", error);
                    Swal.fire({
                        title: "ເກີດຂໍ້ຜິດພາດ!",
                        text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້",
                        icon: "error"
                    });
                } finally {
                    setLoading(false)
                }

            }
        });
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
                            {/* Image Upload */}
                            <div className="mb-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-[250px] w-full text-center p-2">
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
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>

                            {/* Title Input */}
                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ຫົວຂໍ້
                                </p>
                                <input
                                    type="text"
                                    placeholder="ເພີ່ມຫົວຂໍ້..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border-2 border-gray-300 rounded-md h-[40px]"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            {/* File Upload */}
                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ອັບໂຫຼດໄຟລ໌
                                </p>
                                <div className="flex items-center relative">
                                    <input
                                        type="text"
                                        placeholder="Upload File"
                                        value={fileName}
                                        readOnly
                                        className="flex-grow p-2 border-2 border-gray-300 rounded-md h-[40px]"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute right-1 px-4 py-2 bg-[#01A7B1] text-white rounded-md h-[32px]"
                                    >
                                        Upload
                                    </button>
                                </div>
                                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                            </div>

                            {/* detail Input */}
                            <div className="mb-6 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ລາຍລະອຽດ
                                </p>
                                <textarea
                                    placeholder="ເພີ່ມລາຍລະອຽດ..."
                                    rows="4"
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    className="w-full resize-none p-2 border border-gray-300 rounded-md"
                                ></textarea>
                                {errors.detail && <p className="text-red-500 text-sm mt-1">{errors.detail}</p>}
                            </div>



                            {/* Submit Button */}
                            <div className='flex items-center justify-center'>
                                <button type="submit" className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full">
                                    ບັນທຶກ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};
