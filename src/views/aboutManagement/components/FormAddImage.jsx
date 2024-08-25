import React, { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Upload, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PlusOutlined } from '@ant-design/icons';

// icons
import { FaArrowLeft } from "react-icons/fa6";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";

// Helper function to convert image file to base64
const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

export const FormAddImage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [errors, setErrors] = useState({});
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const validateForm = () => {
        let newErrors = {};
        if (fileList.length === 0) newErrors.image = 'ກະລຸນາອັບໂຫຼດຮູບພາບກ່ອນ!';
        if (!title.trim()) newErrors.title = 'ກະລຸນາປ້ອນຫົວຂໍ້ກ່ອນ!';
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
        Swal.fire({
            title: "ທ່ານຕ້ອງການບັນທຶກລາຍການນີ້ແມ່ນບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            cancelButtonText: 'ຍົກເລີກ'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "ບັນທຶກສຳເລັດ!",
                    //text: "Your item has been saved.",
                    icon: "success"
                });
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
                                    ຊື່ຮູບ
                                </p>
                                <input
                                    type="text"
                                    placeholder="ເພີ່ມຊື່ຮູບ..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border-2 text-[14px] border-gray-300 rounded-md h-[40px]"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            {/* Image Upload */}
                            <div className="mb-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-[350px] w-full text-center p-2">
                                    <Upload
                                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                    >
                                        {fileList.length >= 8 ? null : uploadButton}
                                    </Upload>
                                    {previewImage && (
                                        <Image
                                            preview={{
                                                visible: previewOpen,
                                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                            }}
                                            src={previewImage}
                                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                                        />
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
