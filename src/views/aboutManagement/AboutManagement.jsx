import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AboutList } from './components/AboutList';
import Swal from 'sweetalert2';
import { getAboutApi, getCompanyDataApi } from '../../api/about';

export const AboutManagement = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const [companyData, setCompanyData] = useState([]);
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

    useEffect(() => {
        fetchCompanydata();
        console.log(companyData);
    }, []);

    const handleDateChange = (dates) => {
        setFilteredDates(dates); // Update the state with selected dates
    };

    const cDataID = companyData?.id;
    return (
        <Sidebar>
            <div className='mt-14'>
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
                        <button onClick={() => navigate('/aboutManagement/aboutBanner')}
                            className="text-white w-[100px] py-2 text-[14px] bg-[#01A7B1] rounded-full">
                            ແກ້ໄຂຮູບໜ້າປົກ
                        </button>
                        <button onClick={() => navigate(`/aboutManagement/aboutInfo/${cDataID}`)}
                            className="text-white w-[100px] py-2 text-[14px] bg-[#01A7B1] rounded-full">
                            ແກ້ໄຂຂໍ້ມູນ
                        </button>
                        <button
                            onClick={() => navigate('/aboutManagement/formAddImage')}
                            className="text-white w-[100px] py-2 text-[14px] bg-[#01A7B1] rounded-full">
                            ເພີ່ມຮູບພາບ
                        </button>
                    </div>
                </div>

                <AboutList
                    filteredDates={filteredDates} // Pass filtered dates to AboutList
                />
            </div>
        </Sidebar>
    );
};
