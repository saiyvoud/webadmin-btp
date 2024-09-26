import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getOneNewsApi, updateNewsApi, updateNewsImageApi } from '../../../api/news';

export const FormEditCardNews = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const [newsData, setNewsData] = useState({});
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const imageInputRef = useRef(null);
    const [isUpload, setIsUpload] = useState(false)

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setIsUpload(true);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const beforeUpload = (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
        }
        return false; // Prevent automatic upload
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getOneNewsApi(id);
            setNewsData(response);
            setTitle(response.title || '');
            setDescription(response.detail || '');
            setCoverImage(`https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${response.cover_image}` || "");
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

    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
                setCoverImageFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        setCoverImageFile(null);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!coverImage && !coverImageFile) newErrors.coverImage = 'ກະລຸນາອັບໂຫຼດຮູບໜ້າປົກກ່ອນ!';
        if (fileList.length === 0) newErrors.image = 'ກະລຸນາອັບໂຫຼດຮູບພາບກ່ອນ!';
        if (!title.trim()) newErrors.title = 'ກະລຸນາປ້ອນຫົວຂໍ້ກ່ອນ!';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSaveData();
    };

    const handleSaveData = async () => {
        const data = {
            title: title,
            detail: description,
        };

        let oldImage = [];
        if (fileList.length > newsData.image.length) {
            const newImages = fileList.slice(newsData.image.length).map(file => file.name);
            oldImage = [...newsData.image, ...newImages];
        } else {
            oldImage = newsData.image.slice(0, fileList.length);
        }

        const dataImg = {
            image: fileList.length > 0 ? fileList.map(file => file.originFileObj) : newsData.image,
            oldImage: oldImage.join(','),
        };

        const dataCover = coverImageFile ? {
            cover_image: coverImageFile,
            oldCover_image: newsData.cover_image
        } : null;

        try {
            const result = await Swal.fire({
                title: "ທ່ານຕ້ອງການບັນທຶກຂໍໍ້ມູນນີ້ເລີຍບໍ່?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ຢຶນຢັນ",
                cancelButtonText: 'ຍົກເລີກ',
            });

            if (result.isConfirmed) {
                setLoading(true);
                const response = await updateNewsApi(id, data);

                if (isUpload) {
                    await updateNewsImageApi(id, dataImg);
                }
                if (dataCover) {
                    await updateNewsImageApi(id, dataCover);
                }

                if (response) {
                    await Swal.fire({
                        title: "ບັນທຶກການແກ້ໄຂສຳເລັດ!",
                        icon: "success",
                    });
                    navigate('/newsManagement');
                }
            }
        } catch (error) {
            console.error("Error updating news:", error);
            await Swal.fire({
                title: "ການແກ້ໄຂລົ້ມເຫຼວ",
                text: error.response?.data?.message || "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sidebar>
            <div className='my-14 flex items-center justify-center'>
                <div>
                    <div onClick={() => navigate(-1)} className='cursor-pointer text-[#01A7B1] text-[16px] mb-5 flex items-center gap-x-3 w-fit'>
                        <FaArrowLeft />
                        <h4>ກັບຄືນ</h4>
                    </div>
                    <div className='rounded-lg bg-white p-10 w-[600px]'>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-y-7'>
                            <div className="mb-6">
                                <p className='text-[14px] font-medium'>ຮູບໜ້າປົກ</p>
                                <div className=' w-full flex justify-center mt-5'>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-[250px] w-[250px] text-center p-2">
                                        {coverImage ? (
                                            <div className='w-full h-full relative'>
                                                <img src={coverImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                <div onClick={removeCoverImage}
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
                                                    onChange={handleCoverImageUpload}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => imageInputRef.current.click()}
                                                    className="bg-[#01A7B1] text-white py-2 px-4 mt-4 rounded-md"
                                                >
                                                    ເລືອກຮູບພາບ
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>ອັບໂຫຼດຮູບພາບ (ຮູບທຳອິດຈະເປັນຮູບໜ້າປົກ)</p>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleChange}
                                    beforeUpload={beforeUpload}
                                    multiple={true}
                                >
                                    {fileList.length >= 20 ? null : uploadButton}
                                </Upload>
                            </div>

                            <div className="mb-4 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>ຫົວຂໍ້</p>
                                <input
                                    type="text"
                                    placeholder="ເພີ່ມຫົວຂໍ້..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border-2 border-gray-300 rounded-md h-[40px]"
                                />
                            </div>

                            <div className="mb-6 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>ລາຍລະອຽດ</p>
                                <textarea
                                    placeholder="ເພີ່ມລາຍລະອຽດ..."
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full resize-none p-2 border border-gray-300 rounded-md"
                                ></textarea>
                            </div>

                            <div className='flex items-center justify-center'>
                                <button
                                    type="submit"
                                    className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading ? <p className='flex items-center justify-center gap-x-3'>ກຳລັງບັນທຶກ <span className="loader"></span></p> : "ບັນທຶກ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};