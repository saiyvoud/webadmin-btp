import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { DatePicker, Empty, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AboutList } from './components/AboutList';
import Swal from 'sweetalert2';
import { getAboutApi, getCompanyDataApi, getCoverImageApi } from '../../api/about';
import { FaTrashAlt } from 'react-icons/fa';

export const AboutManagement = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const [companyData, setCompanyData] = useState([]);
    const [converImg, setCoverImg] = useState([])
    const [filteredDates, setFilteredDates] = useState([]); // Add state to store the filtered dates

    const fetchCompanydata = async () => {
        setLoading(true);
        try {
            const response = await getCompanyDataApi();
            setCompanyData(response);
        } catch (error) {
            Swal.fire({
                title: "ເກີດຂໍ້ຜິດພາດ!",
                text: "ການດຶງຂໍ້ມູນບໍ່ສຳເລັດ",
                icon: "error"
            });
            console.log("Error response About Data", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchDataAboutBanner = async () => {
        setLoading(true);
        try {
            const response = await getCoverImageApi()
            setCoverImg(response)
        } catch (error) {
            Swal.fire({
                title: "ເກີດຂໍ້ຜິດພາດ!",
                text: "ການດຶງຂໍ້ມູນບໍ່ສຳເລັດ",
                icon: "error"
            });
            console.log("Error response About Data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCompanydata();
        fetchDataAboutBanner()
    }, []);
    // console.log("cover img", converImg[0]);

    const handleDateChange = (dates) => {
        setFilteredDates(dates); // Update the state with selected dates
    };

    const cDataID = companyData?.map((item) => item?.id);
    // console.log("converImg", cDataID[0]);
    return (
        <Sidebar>
            <div className='mt-4'>
                <div className='bg-white rounded-lg p-10 flex items-center justify-between'>
                    <div>
                        <RangePicker
                            className='border-2 border-[#01A7B1] rounded-full py-2 px-5'
                            style={{ color: '#01A7B1' }}
                            placeholder={['ວັນທີ່ເລີ່ມຕົ້ນ', 'ວັນທີ່ສິ້ນສຸດ']}
                            onChange={handleDateChange} // Handle date change
                        />
                    </div>
                    <div className='flex items-center gap-x-10'>
                        {
                            companyData.length < 1 && (
                                <button onClick={() => navigate(`/aboutManagement/formAddCompanyInfo`)}
                                    className="text-white w-[140px] py-2 text-[14px] bg-[#01A7B1] rounded-full">
                                    ເພີ່ມຂໍ້ມູນບໍລິສັດ
                                </button>
                            )
                        }
                        <button onClick={() => navigate(`/aboutManagement/aboutInfo/${cDataID[0]}`)}
                            className="text-white w-[140px] py-2 text-[14px] bg-[#01A7B1] rounded-full">
                            ແກ້ໄຂຂໍ້ມູນບໍລິສັດ
                        </button>
                        {
                            converImg.length < 1 && (
                                <button onClick={() => navigate('/aboutManagement/addAboutBanner')}
                                    className="text-white w-[120px] py-2 text-[14px] bg-[#01A7B1] rounded-full">
                                    ເພີ່ມຮູບໜ້າປົກ
                                </button>
                            )
                        }
                        <button onClick={() => navigate('/aboutManagement/aboutBanner')}
                            className="text-white w-[120px] py-2 text-[14px] bg-[#01A7B1] rounded-full">
                            ແກ້ໄຂຮູບໜ້າປົກ
                        </button>
                    </div>
                </div>
                <div className=' w-full h-[120px] mt-5 rounded-lg flex items-center justify-center '>
                    {
                        converImg.length > 0 ? (
                            converImg?.map((item) => (
                                <img src={item?.image} alt=""
                                    className=' h-full w-full rounded-lg object-cover'
                                />
                            ))
                        ) : (
                            converImg.length == 0 ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="h-full w-full rounded-lg object-cover">
                                        <Skeleton active avatar />
                                    </div>
                                ))
                            ) : (
                                <Empty description="ບໍ່ມີຂໍ້ມູນຮູບພາບພື້ນຫຼັງ" />
                            )
                        )
                    }
                </div>
                {/* <div className=' z-10 absolute right-2 top-2 bg-black/70 flex items-center justify-center w-[25px] h-[25px] rounded'>
                                        <FaTrashAlt className='  text-white' />
                                    </div> */}

                <AboutList
                    filteredDates={filteredDates} cDataID={cDataID}
                />
            </div>
        </Sidebar>
    );
};
