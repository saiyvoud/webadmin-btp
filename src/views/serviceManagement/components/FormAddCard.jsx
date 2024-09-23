import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Select } from 'antd';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addServiceApi } from '../../../api/serivce';
import { getServiceApi } from '../../../api/serviceInfo';

export const FormAddCard = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    // const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    // const [errors, setErrors] = useState({});
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [documents, setDocuments] = useState([]);
    const [typeScholarship, setTypeScholarship] = useState([]);
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    // const [fileName, setFileName] = useState('');
    const [typeService, setTypeService] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileImg, setFileImg] = useState(null);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');

    const handleInputChange1 = (e) => {
        setInputValue1(e.target.value);
    };

    const handleInputChange2 = (e) => {
        setInputValue2(e.target.value);
    };

    const addTag1 = () => {
        if (inputValue1.trim() !== '') {
            setDocuments([...documents, inputValue1.trim()]);
            setInputValue1('');
        }
    };

    const addTag2 = () => {
        if (inputValue2.trim() !== '') {
            setTypeScholarship([...typeScholarship, inputValue2.trim()]);
            setInputValue2('');
        }
    };

    const handleInputKeyDown1 = (e) => {
        if (e.key === 'Enter' && inputValue1.trim() !== '') {
            e.preventDefault();
            addTag1();
        }
    };

    const handleInputKeyDown2 = (e) => {
        if (e.key === 'Enter' && inputValue2.trim() !== '') {
            e.preventDefault();
            addTag2();
        }
    };

    const removeTag1 = (indexToRemove) => {
        setDocuments(documents.filter((_, index) => index !== indexToRemove));
    };

    const removeTag2 = (indexToRemove) => {
        setTypeScholarship(typeScholarship.filter((_, index) => index !== indexToRemove));
    };

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

    // const handleFileChange = (event) => {
    //     const selectedFile = event.target.files[0];
    //     if (selectedFile) {
    //         setFile(selectedFile);
    //         setFileName(selectedFile.name);
    //     }
    // };
    // ฟังก์ชัน handleFileChange สำหรับอัปเดตไฟล์เมื่อมีการเลือกไฟล์ใหม่
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);  // Convert FileList to array
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);  // Append new files
    };


    // ฟังก์ชันสำหรับลบไฟล์ที่เลือก
    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };



    const validateForm = () => {
        let newErrors = {};
        if (!image) newErrors.image = 'ກະລຸນາອັພໂຫຼດຮູບພາບກ່ອນ!';
        if (!title.trim()) newErrors.title = 'ກະລຸນາປ້ອນຫົວຂໍ້!';

        // Correct the file validation by checking if the array is empty
        if (files.length === 0) newErrors.files = 'ກະລຸນາອັບໂຫຼດໄຟລ໌!';

        if (!category) newErrors.category = 'ກະລຸນາເລືອກປະເພດທຶນ!';
        if (!description.trim()) newErrors.description = 'ກະລຸນາປ້ອນລາຍລະອຽດ!';
        if (documents.length === 0 && typeScholarship.length === 0) {
            newErrors.tags = 'ກະລຸນາເພີ່ມແທັກຢ່າງໜ້ອຍໜຶ່ງອັນໃນກຸ່ມໃດກຸ່ມໜຶ່ງ!';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            await handleSaveData();
        } else {
            //console.log('Form has errors');
        }
    };

    const handleSaveData = async () => {
        try {
            const result = await Swal.fire({
                title: "ທ່ານຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ເລີຍບໍ່?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ຢຶນຢັນ",
                cancelButtonText: 'ຍົກເລີກ'
            });

            if (result.isConfirmed) {
                setLoading(true);
                const data = {
                    description,
                    title,
                    file: files,
                    category_id: category,
                    image: fileImg,
                    document: documents,  // Changed from documents to document
                    typescholarship: typeScholarship  // Changed from typeScholarship to typescholarship
                };

                const response = await addServiceApi(data);

                if (response) {
                    await Swal.fire({
                        title: "ບັນທຶກສຳເລັດ!",
                        icon: "success"
                    });
                    navigate('/serviceManagement');
                } else {
                    throw new Error("API request failed");
                }
            }
        } catch (error) {
            console.error("Error saving data:", error);
            await Swal.fire({
                title: "Error ການບັນທຶກລົ້ມເຫຼວ",
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };
    //console.log(files);
    return (
        <Sidebar>
            <div className='my-14 flex items-center justify-center'>
                <div>
                    <div onClick={() => navigate(-1)}
                        className='cursor-pointer text-[#01A7B1] text-[16px] mb-5 flex items-center gap-x-3 w-fit'>
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
                            <div className="mb-0 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ອັບໂຫຼດໄຟລ໌
                                </p>
                                <div className="flex items-center relative">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="application/pdf"
                                        multiple  // อนุญาตให้เลือกหลายไฟล์
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="px-4 py-2 bg-[#01A7B1] text-white rounded-md"
                                    >
                                        Upload
                                    </button>
                                </div>

                            </div>

                            {/* ສະແດງຟາຍ */}
                            <div className="mb-4">
                                <p className='text-[14px] font-medium'>
                                    ໄຟລ໌ທີ່ເລືອກ:
                                </p>
                                <ul className="list-disc flex flex-col gap-y-2 pl-5">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between px-2 py-1.5 rounded-md border-[2px]">
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}
                            </div>


                            {/* Category Selection */}
                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ເລືອກປະເພດທຶນຕ່າງໆ
                                </p>
                                <Select
                                    placeholder="ກະລຸນາເລືອກປະເພດທຶນຕ່າງໆ"
                                    style={{ width: '100%' }}
                                    onChange={(value) => setCategory(value)}
                                    options={typeService?.map((item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }))}
                                />
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>

                            {/* Tag List Input for Group 1 */}
                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ເອກະສານ
                                </p>
                                <div className="w-full">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {documents.map((tag, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                                                {tag}
                                                <button onClick={() => removeTag1(index)} className="ml-1 text-blue-600 hover:text-blue-800">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={inputValue1}
                                            onChange={handleInputChange1}
                                            onKeyDown={handleInputKeyDown1}
                                            placeholder="ພິມ ແລະ ກົດ Enter ເພື່ອເພີ່ມ Tags"
                                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-teal-500"
                                        />
                                        <button
                                            onClick={addTag1}
                                            className="px-3 py-2 bg-[#01A7B1] text-white rounded-r-md hover:bg-teal-600 focus:outline-none"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tag List Input for Group 2 */}
                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ປະເພດທຶນ
                                </p>
                                <div className="w-full">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {typeScholarship.map((tag, index) => (
                                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                                                {tag}
                                                <button onClick={() => removeTag2(index)} className="ml-1 text-green-600 hover:text-green-800">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={inputValue2}
                                            onChange={handleInputChange2}
                                            onKeyDown={handleInputKeyDown2}
                                            placeholder="ພິມ ແລະ ກົດ Enter ເພື່ອເພີ່ມ Tags"
                                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-teal-500"
                                        />
                                        <button
                                            onClick={addTag2}
                                            className="px-3 py-2 bg-[#01A7B1] text-white rounded-r-md hover:bg-teal-600 focus:outline-none"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}

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
            </div>
        </Sidebar>
    );
};