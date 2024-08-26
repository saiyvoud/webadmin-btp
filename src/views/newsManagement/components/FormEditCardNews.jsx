import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getNewsApi, updateNewsApi, updateNewsFileApi, updateNewsImageApi } from '../../../api/news';

export const FormEditCardNews = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [detail, setDetail] = useState('');
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [newsData, setNewsData] = useState([]);
    const [showImage, setShowImage] = useState(true);
    const [fileImg, setFileImg] = useState(null);
    const { id } = useParams(); // Extract the ID from URL parameters

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getNewsApi();
            if (!response) throw new Error('No response from API');
            setNewsData(response);
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
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
        }
        setFileImg(file);
        setShowImage(true);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleImageRemove = () => {
        setImage(null);
        setShowImage(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSaveData(id);
    };

    const handleSaveData = async (id) => {
        Swal.fire({
            title: "ທ່ານຕ້ອງການບັນທຶກຂໍໍ້ມູນນີ້ເລີຍບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຢຶນຢັນ",
            cancelButtonText: 'ຍົກເລີກ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = {
                    title,
                    detail,
                };

                const dataImg = {
                    image: fileImg,
                    oldImage: newsData.find(item => item.id == id)?.image,
                };

                const dataFile = {
                    file: file,
                    oldFile: newsData.find(item => item.id == id)?.file_url
                };

                try {
                    const [response, responseImg, responseFile] = await Promise.all([
                        updateNewsApi(id, data),
                        updateNewsImageApi(id, dataImg),
                        updateNewsFileApi(id, dataFile)
                    ]);

                    if (response && responseImg && responseFile) {
                        Swal.fire({
                            title: "ບັນທຶກການແກ້ໄຂສຳເລັດ!",
                            icon: "success",
                        }).then(() => {
                            navigate('/newsManagement');
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error ການແກ້ໄຂລົ້ມເຫຼວ",
                        icon: "error",
                    });
                    console.error("Error updating news:", error);
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
                            {newsData.filter(item => item.id == id).map((item, index) => (
                                <div key={index}>
                                    <div className="mb-6">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-[250px] w-full text-center p-2">
                                            {showImage ? (
                                                <div className='w-full h-full relative'>
                                                    <img src={image || item.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                    <div onClick={handleImageRemove}
                                                        className='w-[25px] h-[25px] absolute top-1 right-1 bg-black/55 rounded-lg cursor-pointer flex items-center justify-center'>
                                                        <FaTrashAlt className='text-white text-[14px]' />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex items-center flex-col justify-center h-full w-full'>
                                                    <FaCloudUploadAlt className="mx-auto text-gray-400 mb-2 text-[52px]" />
                                                    <p className="text-gray-400">
                                                        Drag & Drop or Click to Upload
                                                    </p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        ref={imageInputRef}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor='title' className='font-medium'>
                                            ເລື່ອງຂ່າວ
                                        </label>
                                        <input type="text" id="title"
                                            defaultValue={item.title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className='mt-3 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01A7B1]' />
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
                                    </div>

                                    <div>
                                        <label htmlFor='detail' className='font-medium'>
                                            ລາຍລະອຽດຂໍໍ້ມູນ
                                        </label>
                                        <textarea
                                            id="detail"
                                            defaultValue={item.detail}
                                            onChange={(e) => setDetail(e.target.value)}
                                            className='mt-3 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01A7B1]'
                                            rows="4"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className='flex justify-center'>
                                <button
                                    type="submit"
                                    className='py-2 px-8 bg-[#01A7B1] hover:bg-[#07cad7] text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#01A7B1] focus:ring-opacity-50'>
                                    ບັນທຶກການແກ້ໄຂ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};
