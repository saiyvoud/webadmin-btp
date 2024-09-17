import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Select } from 'antd';
import { X, Plus } from 'lucide-react';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getServiceApi } from '../../../api/serviceInfo';
import { getOneService, updateServiceApi, updateServiceFileApi, updateServiceImage } from '../../../api/serivce';
import { GetFileObjectApi, GetFilePDF } from '../../../api/file';

export const FormEditService = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState([]);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [typeService, setTypeService] = useState([]);
    const [dataService, setDataService] = useState({});
    const [showImage, setShowImage] = useState(true);
    const [fileImg, setFileImg] = useState(null);
    const [fileIcon, setFileIcon] = useState(null);
    const [fileObject, setFileObject] = useState([]);
    const { id } = useParams();
    const [documents, setDocuments] = useState([]);
    const [typeScholarship, setTypeScholarship] = useState([]);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [existingFiles, setExistingFiles] = useState([]);
    const [changeImage, setChangeImage] = useState(false)


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
            if (!response) throw new Error('No response from API');
            setTypeService(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchDataService = async () => {
        setLoading(true);
        try {
            const response = await getOneService(id);
            const fileIcon = await GetFileObjectApi(response.image);

            const files = await Promise.all(response.file_url.map((url, index) => GetFilePDF(url[index])));

            setFileObject(files);
            setFileIcon(fileIcon);
            setDataService(response);
            setTitle(response.title);
            setDescription(response.description);
            setCategory(response.category_id);
            setDocuments(response.document || []);
            setTypeScholarship(response.typescholarship || []);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataService();
    }, [id]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setFileImg(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
        }
        setShowImage(true);
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const handleImageRemove = () => {
        setImage(null);
        setShowImage(false);
        setFileImg(null);
        setChangeImage(!changeImage)
    };

    console.log("fileObject type:", typeof fileObject);
    console.log("dataService reduce ======= \n", fileObject)


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await Swal.fire({
                title: "ທ່ານຕ້ອງການແກ້ໄຂຂໍໍ້ມູນນີ້ບໍ່?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ຢຶນຢັນ",
                cancelButtonText: 'ຍົກເລີກ'
            });

            if (result.isConfirmed) {
                setLoading(true);

                // Prepare the data to be updated
                const data = {
                    description,
                    title,
                    category_id: category,
                    document: documents,
                    typescholarship: typeScholarship
                };

                // Check if a new image is uploaded, otherwise use the existing one
                const dataImage = {
                    image: fileImg || fileIcon,
                    oldImage: dataService.image
                };

                // Check if there are new files to upload, otherwise use existing files
                const dataFile = {
                    file: files.length > 0 ? files : fileObject,
                    oldFile: files.length > 0
                        ? dataService.file_url.slice(0, files.length).join(',')
                        : dataService.file_url.join(',')
                };

                // Update the service data
                const response = await updateServiceApi(id, data);
                if (!response) {
                    throw new Error("Failed to update service data");
                }

                // Update the image if it has changed
                if (changeImage) {
                    const imageResponse = await updateServiceImage(id, dataImage);
                    if (!imageResponse) {
                        throw new Error("Failed to update image");
                    }
                }

                // Update the files if new ones have been added
                if (files.length > 0) {
                    const fileResponse = await updateServiceFileApi(id, dataFile);
                    if (!fileResponse) {
                        throw new Error("Failed to update files");
                    }
                }

                await Swal.fire({
                    title: "ແກ້ໄຂສຳເລັດ!",
                    icon: "success"
                });

                navigate('/serviceManagement');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            Swal.fire({
                title: "ແກ້ໄຂລົ້ມເຫຼວ",
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
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
                                        {showImage ? (
                                            <div className='w-full h-full relative'>
                                                <img src={image || `https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${dataService.image}`} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                <div onClick={handleImageRemove}
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
                                                    className="mt-2 px-4 py-2 bg-[#01A7B1] text-white text-[14px] rounded-lg"
                                                >
                                                    ເລືອກຮູບພາບ
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='mb-6'>
                                    <label htmlFor='title' className='ml-3 text-[14px]'>ຫົວຂໍ້:</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
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

                                    {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}
                                </div>

                                <div className='mb-4'>
                                    <label htmlFor='typeService' className='ml-3 text-[14px]'>ເລືອກປະເພດທຶນຕ່າງໆ:</label>
                                    <Select
                                        id='typeService'
                                        value={category}
                                        onChange={(value) => setCategory(value)}
                                        className='w-full'
                                    >
                                        {typeService.map((type) => (
                                            <Select.Option key={type.id} value={type.id}>
                                                {type.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="mb-4 flex flex-col gap-y-2">
                                    <p className='text-[14px] font-medium'>
                                        ເອກະສານ
                                    </p>
                                    <div className="w-full">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {documents.map((tag, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                                                    {tag}
                                                    <div onClick={() => removeTag1(index)} className="ml-1 cursor-pointer text-blue-600 hover:text-blue-800">
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
                                            <button
                                                type="button"
                                                onClick={addTag1}
                                                className="px-3 py-2 bg-[#01A7B1] text-white rounded-r-md hover:bg-teal-600 focus:outline-none"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 flex flex-col gap-y-2">
                                    <p className='text-[14px] font-medium'>
                                        ປະເພດທຶນ
                                    </p>
                                    <div className="w-full">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {typeScholarship.map((tag, index) => (
                                                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                                                    {tag}
                                                    <div onClick={() => removeTag2(index)} className="ml-1 cursor-pointer text-green-600 hover:text-green-800">
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
                                            <button
                                                type="button"
                                                onClick={addTag2}
                                                className="px-3 py-2 bg-[#01A7B1] text-white rounded-r-md hover:bg-teal-600 focus:outline-none"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}

                                <div>
                                    <label htmlFor='description' className='ml-3 text-[14px]'>ລາຍລະອຽດ:</label>
                                    <textarea
                                        id='description'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className='border border-gray-300 rounded-lg px-4 py-2 w-full h-[120px]'
                                    ></textarea>
                                </div>

                                <div className='flex items-center justify-center mt-5'>
                                    <button
                                        type="submit"
                                        className="w-[120px] py-3 text-[14px] font-medium bg-[#01A7B1] text-white rounded-full flex items-center justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <p className='flex items-center justify-center gap-x-3'>
                                                ກຳລັງແກ້ໄຂ <span className="loader"></span>
                                            </p>
                                        ) : (
                                            "ແກ້ໄຂ"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};