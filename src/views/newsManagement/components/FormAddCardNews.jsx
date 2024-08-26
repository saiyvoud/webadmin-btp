import React, { useState, useRef } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addNewsApi } from '../../../api/news';
// import { addNewsApi } from 'path/to/your/api/file'; 

export const FormAddCardNews = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [fileImg, setFileImg] = useState('');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
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
        if (!file) newErrors.file = 'Please upload a file';
        if (!description.trim()) newErrors.description = 'ກະລຸນາປ້ອນລາຍລະອຽດກ່ອນ!';
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

    const handleSaveData = async () => {
        const data = {
            title: title,
            detail: description,
            image: fileImg,
            file: file,
        };

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
                setIsLoading(true);
                try {
                    const response = await addNewsApi(data);
                    setIsLoading(false);
                    if (response) {
                        Swal.fire({
                            title: "ບັນທຶກສຳເລັດ!",
                            icon: "success"
                        });
                        // Reset form or navigate away
                        resetForm();
                        navigate('/newsManagement');
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
                }
            }
        });
    };

    const resetForm = () => {
        setImage(null);
        setImagePreview(null);
        setTitle('');
        setFile(null);
        setFileName('');
        setDescription('');
        setErrors({});
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
                                    {imagePreview ? (
                                        <div className='w-full h-full relative'>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                            <div onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
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

                            {/* Description Input */}
                            <div className="mb-6 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ລາຍລະອຽດ
                                </p>
                                <textarea
                                    placeholder="ເພີ່ມລາຍລະອຽດ..."
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full resize-none p-2 border border-gray-300 rounded-md"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className='flex items-center justify-center'>
                                <button
                                    type="submit"
                                    className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};