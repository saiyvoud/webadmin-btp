import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { Sidebar } from '../../components/Sidebar';
import announceImg from '../../assets/images/webp/announce.webp';
import { AreaCharts } from './charts/AreaCharts';
import { PieCharts } from './charts/PieCharts';
import { getServiceApi } from '../../api/serviceInfo';
import { getBannerApi } from '../../api/banner';
import { formatDate } from '../utils';
import { getViewApi } from '../../api/view';
import { AreaChartMonth } from './charts/AreaChartMonth';
import { AreaChartsYear } from './charts/AreaChartsYear';

export const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [banner, setBanner] = useState([]);
    const [view, setView] = useState([]);
    const [selectChart, setSelectChart] = useState(0);

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}/${month}/${day}`;

    const fetchData = async () => {
        setLoading(true);
        const [response, responseBanner, responseView] = await Promise.all([
            getServiceApi(),
            getBannerApi(),
            getViewApi(formattedDate)
        ]);
        setCategory(response);
        setBanner(responseBanner);
        setView(responseView);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalItems = 100; // Example total items for percentage calculation

    // Calculate percentages
    const categoryPercentage = (category.length / totalItems) * 100;
    const bannerPercentage = (banner.length / totalItems) * 100;

    return (
        <Sidebar>
            <div className='mt-10'>
                <div className='w-full h-[270px] rounded-lg'>
                    <img
                        src={announceImg}
                        alt=""
                        className='h-full w-full object-cover rounded-lg'
                    />
                </div>
                <div className='grid grid-cols-12 mt-10 gap-x-10'>
                    <div className='col-span-7'>
                        <div className='w-full bg-white rounded-lg mb-5'>
                            <div className='flex justify-between items-center mb-5 px-8 pt-8'>
                                <h4 className='text-[14px] font-medium'>
                                    ຍອດຜູ້ເຂົ້າເບິ່ງເວັບໄຊຕ໌
                                </h4>
                                <Select
                                    labelInValue
                                    onChange={(e) => setSelectChart(e.value)}
                                    defaultValue={{ value: 0, label: 'ລາຍວັນ' }}
                                    style={{ width: 100 }}
                                    options={[
                                        { value: 0, label: 'ລາຍວັນ' },
                                        { value: 1, label: 'ລາຍເດືອນ' },
                                        { value: 2, label: 'ລາຍປີ' },
                                    ]}
                                />
                            </div>
                            {selectChart === 0 && <AreaCharts view={view} />}
                            {selectChart === 1 && <AreaChartMonth view={view} />}
                            {selectChart === 2 && <AreaChartsYear view={view} />}
                        </div>
                        <div className='flex gap-x-5 w-full'>
                            <div className='h-[150px] bg-white rounded-lg p-7 w-full flex flex-col gap-y-7'>
                                <h6>ທືນການສືກສາທັງຫມົດທັງຫມົດ</h6>
                                <h1 className='text-[28px] font-medium'>
                                    <span className='text-[#00BAAF] text-[28px]'>
                                        {category.length}
                                    </span> ລາຍການ
                                </h1>
                                <div className='relative w-full flex items-center h-[4px] rounded-full bg-[#F1F5F9]'>
                                    <div
                                        className='absolute left-0 h-[4px] bg-[#00BAAF] rounded-full'
                                        style={{ width: `${categoryPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className='h-[150px] bg-white rounded-lg p-7 w-full flex flex-col gap-y-7'>
                                <h6>ໂຄສະນາທັງຫມົດ</h6>
                                <h1 className='text-[28px] font-medium'>
                                    <span className='text-[#00BAAF] text-[28px]'>
                                        {banner.length}
                                    </span> ລາຍການ
                                </h1>
                                <div className='relative w-full flex items-center h-[4px] rounded-full bg-[#F1F5F9]'>
                                    <div
                                        className='absolute left-0 h-[4px] bg-[#00BAAF] rounded-full'
                                        style={{ width: `${bannerPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-5 w-full h-full'>
                        <div className='w-full h-full bg-white rounded-lg flex items-center justify-center'>
                            <PieCharts category={category} />
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};
