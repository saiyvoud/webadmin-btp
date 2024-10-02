import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { DatePicker, Empty, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AboutList } from './components/AboutList';
import { useAboutStore } from '../../store/aboutStore'; // Import Zustand store

export const AboutManagement = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;

    // ดึง state และ actions จาก store
    const {
        companyData,
        coverImg,
        loading,
        fetchCompanyData,
        fetchCoverImg
    } = useAboutStore();

    const [filteredDates, setFilteredDates] = useState([]); // เก็บวันที่กรอง

    useEffect(() => {
        // เรียกใช้ fetchCompanyData และ fetchCoverImg ครั้งแรกตอน component ถูก mount
        fetchCompanyData();
        fetchCoverImg();
    }, [fetchCompanyData, fetchCoverImg]);

    const handleDateChange = (dates) => {
        setFilteredDates(dates); // อัพเดตวันที่ที่ถูกเลือก
    };

    const cDataID = companyData?.map((item) => item?.id); // ดึง ID ของข้อมูลบริษัท

    return (
        <Sidebar>
            <div className="mt-4">
                <div className="bg-white rounded-lg sm:p-4 lg:p-6 xl:p-10 flex items-center justify-between">
                    <div>
                        <RangePicker
                            className="border-2 border-[#01A7B1] rounded-full py-2 px-3 xl:px-5 lg:text-[14px] sm:text-[12px]"
                            style={{ color: '#01A7B1' }}
                            placeholder={['ວັນທີ່ເລີ່ມຕົ້ນ', 'ວັນທີ່ສິ້ນສຸດ']}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="xl:flex xl:items-center place-items-center sm:grid sm:grid-cols-12 lg:grid-cols-12 lg:gap-x-5 xl:gap-x-10 lg:gap-3 sm:gap-2">
                        {companyData.length < 1 && (
                            <button
                                onClick={() => navigate(`/aboutManagement/formAddCompanyInfo`)}
                                className="text-white lg:w-[140px] sm:w-[110px] sm:col-span-6 py-2 sm:text-[12px] lg:text-[14px] bg-[#01A7B1] rounded-full"
                            >
                                ເພີ່ມຂໍ້ມູນບໍລິສັດ
                            </button>
                        )}
                        <button
                            onClick={() => navigate(`/aboutManagement/aboutInfo/${cDataID[0]}`)}
                            className="text-white lg:w-[140px] sm:w-[110px] sm:col-span-6 py-2 sm:text-[12px] lg:text-[14px] bg-[#01A7B1] rounded-full"
                        >
                            ແກ້ໄຂຂໍ້ມູນບໍລິສັດ
                        </button>
                        {coverImg.length < 1 && (
                            <button
                                onClick={() => navigate('/aboutManagement/addAboutBanner')}
                                className="text-white lg:w-[140px] sm:w-[110px] sm:col-span-6 py-2 sm:text-[12px] lg:text-[14px] bg-[#01A7B1] rounded-full"
                            >
                                ເພີ່ມຮູບໜ້າປົກ
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/aboutManagement/aboutBanner')}
                            className="text-white lg:w-[140px] sm:w-[110px] sm:col-span-6 py-2 sm:text-[12px] lg:text-[14px] bg-[#01A7B1] rounded-full"
                        >
                            ແກ້ໄຂຮູບໜ້າປົກ
                        </button>
                    </div>
                </div>

                <div className="w-full h-[120px] mt-5 rounded-lg flex items-center justify-center">
                    {coverImg.length > 0 ? (
                        coverImg.map((item) => (
                            <img
                                key={item?.id}
                                src={`https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${item?.image}`}
                                alt=""
                                className="h-full w-full rounded-lg object-cover"
                            />
                        ))
                    ) : loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-full w-full rounded-lg object-cover">
                                <Skeleton active avatar />
                            </div>
                        ))
                    ) : (
                        <Empty description="ບໍ່ມີຂໍ້ມູນຮູບພາບພື້ນຫຼັງ" />
                    )}
                </div>

                <AboutList filteredDates={filteredDates} cDataID={cDataID} />
            </div>
        </Sidebar>
    );
};
