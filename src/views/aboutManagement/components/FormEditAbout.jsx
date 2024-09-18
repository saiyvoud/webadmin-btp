import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaArrowLeft } from "react-icons/fa6";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { updateAboutApi, getAboutOneApi, updateAboutImageApi } from '../../../api/about';
import { GetFileObjectApi } from '../../../api/file';

export const FormEditAbout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null);
    const [fileImg, setFileImg] = useState(null);
    const imageInputRef = useRef(null);
    const [title, setTitle] = useState('');
    const [errors, setErrors] = useState({});
    const [aboutOne, setAboutOne] = useState({});
    const [fileConvertImg, setFileConvertImg] = useState();
    const { id } = useParams();

    const fetchData = async (id) => {
        try {
            const response = await getAboutOneApi(id);
            setAboutOne(response);
            setTitle(response.title);

            if (response.images && response.images.length > 0) {
                const fileImg = await GetFileObjectApi(response.images[0]);
                setFileConvertImg(fileImg);
                setImage(URL.createObjectURL(fileImg));
            }
        } catch (error) {
            console.error("Error fetching api get one in about", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

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

    const validateForm = () => {
        let newErrors = {};
        if (!image) newErrors.image = 'ກະລຸນາອັບໂຫຼດຮູບພາບກ່ອນ!';
        if (!title.trim()) newErrors.title = 'ກະລຸນາປ້ອນຫົວຂໍ້ກ່ອນ!';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleSaveData();
        } else {
            //console.log('Form has errors');
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = { title };
                const dataImg = {
                    images: fileImg ? fileImg : fileConvertImg,
                    oldImages: aboutOne.images
                };

                try {
                    const [response, responseImg] = await Promise.all([
                        updateAboutApi(id, data),
                        fileImg ? updateAboutImageApi(id, dataImg) : Promise.resolve()
                    ]);
                    setLoading(true)

                    if (response && responseImg) {
                        Swal.fire({
                            title: "ບັນທຶກສຳເລັດ!",
                            icon: "success"
                        });
                        setLoading(false)
                        navigate('/aboutManagement');
                    }
                } catch (error) {
                    console.error("Error updating about", error);
                    Swal.fire({
                        title: "ເກີດຂໍ້ຜິດພາດ!",
                        text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້",
                        icon: "error"
                    });
                }
            }
        });
    };

    //console.log("oone", `https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${aboutOne.images}`);
    //console.log("oone", image);

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

                            <div className="mb-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-[300px] w-full text-center p-2">
                                    {image ? (
                                        <div className='w-full h-full relative'>
                                            <img src={fileImg ? image : `https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${aboutOne.images}`} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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

                            <div className='flex items-center justify-center'>
                                <button
                                    disabled={loading}
                                    type="submit" className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full">
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