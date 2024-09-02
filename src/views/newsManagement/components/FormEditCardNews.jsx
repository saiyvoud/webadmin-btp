import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { X, Plus } from 'lucide-react';
import { getOneNewsApi, updateNewsApi, updateNewsFileApi, updateNewsImageApi } from '../../../api/news';
import { GetFileObjectApi, getFilePDF } from '../../../api/file';

export const FormEditCardNews = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [detail, setDetail] = useState('');
    const [fileName, setFileName] = useState('');
    const [newsData, setNewsData] = useState({});
    const [showImage, setShowImage] = useState(true);
    const [fileImg, setFileImg] = useState(null);
    const [fileImgObject, setFileImgObject] = useState(null);
    const [fileObject, setFileObject] = useState(null);

    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [documents, setDocuments] = useState([]);
    const [typeScholarship, setTypeScholarship] = useState([]);
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
            setLoading(true);
            const response = await getOneNewsApi(id);
            const fileImg = await GetFileObjectApi(response.image);
            const file = await getFilePDF(response.file_url);
            setNewsData(response);
            setFileImgObject(fileImg);
            setFileObject(file);

            // Populate form fields with newsData
            setTitle(response.title || '');
            setDetail(response.detail || '');
            setImage(response.image);
            setFileName(response.file_url ? response.file_url.split('/').pop() : '');
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
    }, [id]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
            setFileImg(file);
            setShowImage(true);
        }
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
        setFileImg(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSaveData();
    };

    const handleSaveData = async () => {
        Swal.fire({
            title: "ທ່ານຕ້ອງການບັນທຶກຂໍໍ້ມູນນີ້ເລີຍບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຢຶນຢັນ",
            cancelButtonText: 'ຍົກເລີກ',
        }).then(async (result) => {
            setLoading(true)
            if (result.isConfirmed) {
                const data = {
                    title,
                    detail,
                    document: documents,
                    typescholarship: typeScholarship
                };
                const dataImg = {
                    image: fileImg ? fileImg : fileImgObject,
                    oldImage: newsData.image,
                };
                const dataFile = {
                    file: file ? file : fileObject,
                    oldFile: newsData.file_url
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
                            <div>
                                <div className="mb-6">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-[250px] w-full text-center p-2">
                                        {showImage && (image || newsData.image) ? (
                                            <div className='w-full h-full relative'>
                                                <img src={image || newsData.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                <div onClick={handleImageRemove}
                                                    className='w-[25px] h-[25px] cursor-pointer absolute top-1 right-1 bg-black/55 rounded-lg flex items-center justify-center'>
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
                                </div>
                                <div>
                                    <label htmlFor='title' className='font-medium'>
                                        ຫົວຂໍ້
                                    </label>
                                    <input type="text" id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className='mt-3 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01A7B1]' />
                                </div>

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
                                        ຂໍ້ມູນຂອງທຶນ
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

                                <div>
                                    <label htmlFor='detail' className='font-medium'>
                                        ລາຍລະອຽດຂໍໍ້ມູນ
                                    </label>
                                    <textarea
                                        id="detail"
                                        value={detail}
                                        onChange={(e) => setDetail(e.target.value)}
                                        className='mt-3 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01A7B1]'
                                        rows="4"
                                    />
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <button
                                    type="submit"
                                    className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {
                                        loading ? <p className=' flex items-center justify-center gap-x-3'>ກຳລັງແກ້ໄຂ <span className="loader"></span></p> : "ແກ້ໄຂ"
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