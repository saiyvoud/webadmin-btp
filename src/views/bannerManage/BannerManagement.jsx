import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { Sidebar } from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { BannerList } from './components/BannerList';

export const BannerManagement = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;
    const [dateRange, setDateRange] = useState(null);

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    return (
        <Sidebar>
            <div className='mt-14'>
                <div className='bg-white rounded-lg p-10 flex items-center justify-between'>
                    <div>
                        <RangePicker
                            className='border-2 border-[#01A7B1] rounded-full py-2 px-5'
                            style={{ color: '#01A7B1' }}
                            placeholder={['ວັນທີ່ເລີ່ມຕົ້ນ', 'ວັນທີ່ສິ້ນສຸດ']}
                            onChange={handleDateChange}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/bannerManagement/formAddBanner')}
                        className="text-white px-4 py-2 text-[14px] bg-[#01A7B1] rounded-full">
                        ເພີ່ມໂຄສະນາ
                    </button>
                </div>

                <BannerList dateRange={dateRange} />
            </div>
        </Sidebar>
    );
};
