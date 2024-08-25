import React, { useState, useRef } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Select } from 'antd';
import { FaArrowLeft } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateCompanyData } from '../../../api/about';

export const FormAboutInfo = () => {
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
    const [fileImg, setFileImg] = useState()
    const cDataID = useParams()
    const id = cDataID.id
    // console.log(id);

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
        if (!description.trim()) newErrors.description = 'ກະລຸນາປ້ອນລາຍລະອຽດກ່ອນ!';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            title: "ທ່ານຕ້ອງການບັນທຶກລາຍການນີ້ແມ່ນບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            cancelButtonText: 'ຍົກເລີກ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = {
                    title,
                    description,
                    image: fileImg
                }
                const response = await updateCompanyData(id, data)
                if (response) {
                    Swal.fire({
                        title: "ບັນທຶກສຳເລັດ!",
                        //text: "Your item has been saved.",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "ການອັພເດຕລົ້ມເຫຼວ!",
                        //text: "Your item has been saved.",
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
                            {/* Title Input */}
                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ຊື່ບໍລິສັດ
                                </p>
                                <input
                                    type="text"
                                    placeholder="ປ້ອນຊື່ບໍລິສັດ..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border-2 border-gray-300 rounded-md h-[40px]"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
