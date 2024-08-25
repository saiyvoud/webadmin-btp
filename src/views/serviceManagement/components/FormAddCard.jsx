import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Select } from 'antd';
import { FaArrowLeft } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addServiceApi } from '../../../api/serivce';
import { getServiceApi } from '../../../api/serviceInfo';

export const FormAddCard = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [typeService, setTypeService] = useState()
    const [loading, setLoading] = useState()
    const [fileImg, setFileImg] = useState()

    const fetchData = async () => {
        try {
            const response = await getServiceApi();
            if (!response) {
                throw new Error('No response from API');
            }
            setTypeService(response);
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
    }

    useEffect(() => {
        fetchData()
        console.log(typeService);
    }, [])

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
    console.log(fileImg);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!image) newErrors.image = 'ກະລຸນາອັພໂຫຼດຮູບພາບກ່ອນ!';
        if (!title.trim()) newErrors.title = 'ກະລຸນາປ້ອນຫົວຂໍ້!';
        if (!file) newErrors.file = 'ກະລຸນາອັບໂຫຼດຟາຍ!';
        if (!category) newErrors.category = 'ກະລຸນາເລືອກປະເພດທຶນ!';
        if (!description.trim()) newErrors.description = 'ກະລຸນາປ້ອນລາຍລະອຽດ!';
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
        Swal.fire({
            title: "ທ່ານຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ເລີຍບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຢຶນຢັນ",
            cancelButtonText: 'ຍົກເລີກ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = {
                    description,
                    title,
                    file,
                    category_id: category,  // Ensure this key matches the expected key in your API
                    image: fileImg
                };

                const response = await addServiceApi(data);

                if (response) {
                    Swal.fire({
                        title: "ບັນທຶກສຳເລັດ!",
                        icon: "success"
                    }).then(() => {
                        navigate('/serviceManagement');
                    });
                } else {
                    Swal.fire({
                        title: "Error ການບັນທຶກລົ້ມເຫຼວ",
                        // text: "Please try again.",
                        icon: "error"
                    });
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
                                                className='w-[25px] h-[25px] absolute top-1 right-1 bg-black/55 rounded-lg flex items-center justify-center'>
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

                            {/* Category Selection */}
                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ເລືອກປະເພດທຶນ
                                </p>
                                <Select
                                    placeholder="Select Category"
                                    style={{ width: '100%' }}
                                    onChange={(value) => setCategory(value)}
                                    options={typeService?.map((item) => ({
                                        value: item.id, // Assuming each category has a unique id
                                        label: item.name,
                                    }))}
                                />

                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
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
