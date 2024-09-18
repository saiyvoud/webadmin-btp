import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCompanyDataApi, updateCompanyData, updateIconCompanyDataApi } from '../../../api/about';
import { GetFileObjectApi } from '../../../api/file';

export const FormAboutInfo = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the company ID from URL params
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [fileImg, setFileImg] = useState(null);
    const [companyInfo, setCompanyInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileIcon, setFileIcon] = useState()

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getCompanyDataApi();
            setCompanyInfo(response);
            const company = response.find(item => item.id === parseInt(id)); // Ensure id is a number
            if (company) {
                setTitle(company.title);
                setDescription(company.description);
                // Assuming 'icon' contains the image URL or path
                // Ensure it's a valid URL or base64 image string
                // setImage(company.icon);
            }
        } catch (error) {
            Swal.fire({
                title: "ເກີດຂໍ້ຜິດພາດ!",
                text: "ການດຶງຂໍ້ມູນບໍ່ສຳເລັດ",
                icon: "error"
            });
            //console.log("Error response About Data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]); // Include id in dependency array to refetch if id changes

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
        if (!description.trim()) newErrors.description = 'ກະລຸນາປ້ອນລາຍລະອຽດກ່ອນ!';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleSaveData();
        }
    };

    const handleSaveData = async () => {
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
                };
                const dataIcon = {
                    icon: fileImg ? fileImg : fileIcon,
                    oldIcon: companyInfo.find(item => item.id === parseInt(id))?.icon // Get the old icon for comparison
                };

                try {
                    // Call both APIs concurrently
                    const response = await updateCompanyData(id, data);
                    if (fileImg) {
                        await updateIconCompanyDataApi(id, dataIcon)
                    } else if (!fileImg) {
                        return
                    }

                    // Handle responses
                    if (response) {
                        Swal.fire({
                            title: "ບັນທຶກສຳເລັດ!",
                            icon: "success"
                        });
                        navigate('/aboutManagement')
                    } else {
                        Swal.fire({
                            title: "ການອັພເດຕລົ້ມເຫຼວ!",
                            icon: "error"
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "ການອັພເດຕລົ້ມເຫຼວ!",
                        icon: "error"
                    });
                    console.error("Error updating company data", error);
                }
            }
        });
    };
    console.log("fileImg c", fileImg);

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
                                <p className='text-[14px] font-medium'>ຊື່ບໍລິສັດ</p>
                                <input
                                    type="text"
                                    placeholder="ປ້ອນຊື່ບໍລິສັດ..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border-2 border-gray-300 rounded-md h-[40px]"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div className="mb-6">
                                <p className='text-[14px] font-medium'>ໂລໂກ້</p>
                                <div className=' w-full flex justify-center mt-5'>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-[250px] w-[250px] text-center p-2">
                                        {image ? (
                                            <div className='w-full h-full relative'>
                                                <img src={fileImg ? image : `https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${companyInfo.icon}`} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                                                    className="bg-[#01A7B1] text-white py-2 px-4 mt-4 rounded-md"
                                                >
                                                    ເລືອກຮູບພາບ
                                                </button>
                                                {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <p className=' mt-3 flex items-center gap-x-1'>
                                    <span className=' text-red-400 underline'>ໝາຍເຫດ:</span>
                                    ຖ້າແກ້ໄຂຂໍ້ມູນໃໝ່ຕ້ອງອັພໂຫຼດຮູບໃໝ່ທຸກຄັ້ງ
                                </p> */}
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    type="submit"
                                    className="bg-[#01A7B1] text-white py-2 px-8 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? <p>ກຳລັງບັນທຶກ... <div className='loader'></div></p> : 'ບັນທຶກ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};
