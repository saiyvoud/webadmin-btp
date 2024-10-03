import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { X, Plus } from 'lucide-react';
import { getBannerOneApi, updateBannerApi, updateFileBannerApi, updateImageBannerApi } from '../../../api/banner';
import { GetFileObjectApi, GetFilePDF } from '../../../api/file';
import { useBannerStore } from '../../../store/bannerStore';

export const FormEditBanner = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [bannerData, setBannerData] = useState([]);
    const [showImage, setShowImage] = useState(true);
    const [fileImg, setFileImg] = useState(null);
    const [fileImgObject, setFileImgObject] = useState()
    const [fileObject, setFileObject] = useState()
    const { id } = useParams();
    const [documents, setDocuments] = useState([]);
    const [typeScholarship, setTypeScholarship] = useState([]);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [existingFiles, setExistingFiles] = useState([]);
    const [changeImage, setChangeImage] = useState(false)
    const fetchBanner = useBannerStore(state => state.fetchBanner);


    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const removeExistingFile = (index) => {
        setFiles(existingFiles.filter((_, i) => i !== index));
    };


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
            const response = await getBannerOneApi(id);  // Fetch data based on ID
            const fileIcon = await GetFileObjectApi(response.image);
            const files = await Promise.all(response.url_path.map((url, index) => GetFilePDF(url[index])));

            // Set the fetched data into state
            setFileImgObject(fileIcon);
            setFileObject(files);
            setBannerData(response);
            setTitle(response.title);           // Set title
            setDetail(response.detail);         // Set detail
            setImage(response.image);           // Set image
            setDocuments(response.document || []);  // Set documents
            setTypeScholarship(response.typescholarship || []);  // Set scholarship types
        } catch (error) {
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

            // Set the file image state
            setFileImg(file);

            // Log the file directly
            //console.log(file);
        }
        setChangeImage(true)
        setShowImage(true);
    };


    const handleImageRemove = () => {
        setImage(null);
        setShowImage(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSaveData(id);
    };

    //console.log("bannerData", bannerData);

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
                setLoading(true)
                const data = {
                    title,
                    detail,
                    document: documents,
                    typescholarship: typeScholarship
                };

                const dataImg = {
                    image: fileImg ? fileImg : fileImgObject,  // fileImg will have the correct value here
                    oldImage: bannerData.image,
                };
                const dataFile = {
                    file: files.length > 0 ? files : fileObject.map(file => file),
                    oldFile: files.length > 0
                        ? bannerData.url_path.slice(0, files.length).join(',')
                        : bannerData.url_path.join(',')
                };

                try {
                    const [response] = await Promise.all([
                        updateBannerApi(id, data),
                    ]);
                    if (changeImage) {
                        await updateImageBannerApi(id, dataImg)
                    }
                    if (files.length > 0) {
                        await updateFileBannerApi(id, dataFile)
                    }

                    if (response) {
                        await fetchBanner(true); // Force refresh banner data
                        Swal.fire({
                            title: "ບັນທຶກການແກ້ໄຂສຳເລັດ!",
                            icon: "success",
                        }).then(() => {
                            fetchBanner(true)
                            navigate('/bannerManagement');
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error ການແກ້ໄຂລົ້ມເຫຼວ",
                        icon: "error",
                    });
                    console.error("Error updating banner:", error);
                } finally {
                    setLoading(false)
                }
            }
        });
    };

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
                            <div className="mb-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-[250px] w-full text-center p-2">
                                    {showImage ? (
                                        <div className='w-full h-full relative'>
                                            <img src={`https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${image}`} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                            </div>

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
                                        multiple
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

                            <div className="mb-4">
                                <p className='text-[14px] font-medium'>
                                    ໄຟລ໌ທີ່ເລືອກ:
                                </p>
                                <ul className="list-disc flex flex-col gap-y-2 pl-5">
                                    {existingFiles.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between px-2 py-1.5 rounded-md border border-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingFile(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </li>
                                    ))}
                                    {files.map((file, index) => (
                                        <li key={`new-${index}`} className="flex items-center justify-between px-2 py-1.5 rounded-md border border-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
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

                                {/* {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>} */}
                            </div>

                            <div className="mb-6 flex flex-col gap-y-2">
                                <p className='text-[14px] font-medium'>
                                    ລາຍລະອຽດ
                                </p>
                                <textarea
                                    rows="4"
                                    placeholder="ເພີ່ມລາຍລະອຽດ..."
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    className="w-full p-2 border-2 border-gray-300 rounded-md"
                                />
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
                                                <div onClick={() => removeTag1(index)} className="ml-1 text-blue-600 hover:text-blue-800">
                                                    <X size={14} />
                                                </div>
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
                                        <div
                                            onClick={addTag1}
                                            className="px-3 py-2 bg-[#01A7B1] text-white rounded-r-md hover:bg-teal-600 focus:outline-none"
                                        >
                                            <Plus size={20} />
                                        </div>
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
                                                <div onClick={() => removeTag2(index)} className="ml-1 text-green-600 hover:text-green-800">
                                                    <X size={14} />
                                                </div>
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
                                        <div
                                            onClick={addTag2}
                                            className="px-3 py-2 bg-[#01A7B1] text-white rounded-r-md hover:bg-teal-600 focus:outline-none"
                                        >
                                            <Plus size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='flex items-center justify-center'>
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
