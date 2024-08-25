import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { Sidebar } from '../../components/Sidebar';
import { NewsList } from './components/NewsList';
import { useNavigate } from 'react-router-dom';

export const NewsManagement = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;

    const [dateRange, setDateRange] = useState([null, null]);

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setDateRange(dates);
        } else {
            setDateRange([null, null]);
        }
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
                            onChange={handleDateRangeChange}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/newsManagement/formAddCardNews')}
                        className="text-white px-4 py-2 text-[14px] bg-[#01A7B1] rounded-full">
                        ເພີ່ມຂ່າວ +
                    </button>
                </div>

                <NewsList dateRange={dateRange} />
            </div>
        </Sidebar>
    );
};
