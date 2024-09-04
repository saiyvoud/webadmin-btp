import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Select } from 'antd';
import { X, Plus } from 'lucide-react';
import { FaArrowLeft, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getServiceApi } from '../../../api/serviceInfo';
import { getOneService, getService, updateServiceApi, updateServiceFileApi, updateServiceImage } from '../../../api/serivce';
import { GetFileObjectApi } from '../../../api/file';

export const FormEditService = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [typeService, setTypeService] = useState([]);
    const [dataService, setDataService] = useState([]);
    const [showImage, setShowImage] = useState(true);
    const [fileImg, setFileImg] = useState()
    const [fileIcon, setFileIcon] = useState()
    const [fileObject, setFileObject] = useState()
    const sid = useParams();
    const id = sid.id
    // console.log(id);
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
            const response = await getServiceApi();
            if (!response) throw new Error('No response from API');
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
    };

    const fetchDataService = async () => {
        console.log("id=", id);
        setLoading(true);
        try {
            const response = await getOneService(id);
            const fileIcon = await GetFileObjectApi(response.image)
            const file = await GetFileObjectApi(response.file_url)

            setFileObject(file);
            setFileIcon(fileIcon);
            setDataService(response);

            // Set initial data for documents and typeScholarship
            setDocuments(response.document || []);
            setTypeScholarship(response.typescholarship || []);

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
        fetchDataService();
    }, []);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSaveData(id);
    };
    // console.log("category", category);

    const handleSaveData = async (id) => {
        Swal.fire({
            title: "ທ່ານຕ້ອງການບັນທຶກຂໍໍ້ມູນນີ້ເລີຍບໍ່?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຢຶນຢັນ",
            cancelButtonText: 'ຍົກເລີກ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = {
                    description,
                    title,
                    category_id: category,
                    document: documents,  // Changed from documents to document
                    typescholarship: typeScholarship  // Changed from typeScholarship to typescholarship
                };
                const dataImage = {
                    image: fileImg ? fileImg : fileIcon,
                    oldImage: dataService.image
                }
                const dataFile = {
                    file: fileObject,
                    oldFile: dataService.file_url
                }
                console.log("dataImage ==> ", dataImage);
                console.log("dataFile ==> ", dataFile);

                try {
                    const [response, responseImg, responseFile] = await Promise.all([
                        updateServiceApi(id, data),
                        updateServiceImage(id, dataImage),
                        updateServiceFileApi(id, dataFile)
                    ])
                    if (response && responseImg && responseFile) {
                        setLoading(true)
                        Swal.fire({
                            title: "ບັນທຶກການແກ້ໄຂສຳເລັດ!",
                            icon: "success"
                        }).then(() => {
                            navigate('/serviceManagement');
                        });
                        setLoading(false)
                    }
                } catch (error) {
                    console.error('Error updating service:', error);
                    Swal.fire({
                        title: "Error ການແກ້ໄຂລົ້ມເຫຼວ",
                        icon: "error"
                    });
                }
            }
        });
    };

    // console.log("ss", dataService.document);
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
                                                <img src={image || dataService.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                                        defaultValue={dataService.title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                    />
                                </div>

                                <div className="mb-4 flex flex-col gap-y-2">
                                    <p className='text-[14px] font-medium'>
                                        ອັບໂຫຼດໄຟລ໌
                                    </p>
                                    <div className="flex items-center relative">
                                        <input
                                            type="text"
                                            placeholder="Upload File"
                                            value={fileName || dataService.file_url}
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

                                <div className='mb-4'>
                                    <label htmlFor='typeService' className='ml-3 text-[14px]'>ປະເພດທຶນ:</label>
                                    <Select
                                        id='typeService'
                                        defaultValue="ກະລຸນາເລືອກທຶນ"
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
                                                defaultValue={dataService.document}
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
                                                defaultValue={dataService.typeScholarship}
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


                                <div>
                                    <label htmlFor='description' className='ml-3 text-[14px]'>ລາຍລະອຽດ:</label>
                                    <textarea
                                        id='description'
                                        defaultValue={dataService.description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className='border border-gray-300 rounded-lg px-4 py-2 w-full h-[120px]'
                                    ></textarea>
                                </div>

                                <div className='flex justify-end'>
                                    <button
                                        disabled={loading}
                                        type='submit' className='bg-[#01A7B1] text-white text-[14px] px-4 py-2 rounded-lg'>
                                        {
                                            loading ? <p className=' flex items-center justify-center gap-x-3'>ກຳລັງແກ້ໄຂ <span className="loader"></span></p> : "ແກ້ໄຂ"
                                        }
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