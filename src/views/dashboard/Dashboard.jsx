import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { Sidebar } from '../../components/Sidebar';
import announceImg from '../../assets/images/webp/announce.webp';
import { AreaCharts } from './charts/AreaCharts';
import { PieCharts } from './charts/PieCharts';
import { getServiceApi } from '../../api/serviceInfo';
import { getBannerApi } from '../../api/banner';
import { getViewApi } from '../../api/view';
import { AreaChartMonth } from './charts/AreaChartMonth';
import { AreaChartsYear } from './charts/AreaChartsYear';
import { getDownloadTotalApi } from '../../api/download';
import { PieChartsMonth } from './charts/PieChartsMonth';
import { PieChartsYear } from './charts/PieChartsYear';
import { getService } from '../../api/serivce';
import { getNewsApi } from '../../api/news';

export const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [banner, setBanner] = useState([]);
    const [news, setNews] = useState([])
    const [view, setView] = useState([]);
    const [totalDownload, setTotalDownLoad] = useState([]);
    const [selectChart, setSelectChart] = useState(0);
    const [selectPieChart, setSelectPieChart] = useState(0);

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}/${month}/${day}`;

    const fetchData = async () => {
        setLoading(true);
        const [response, responseBanner, responseNews, responseView, responseTotal] = await Promise.all([
            getService(),
            getBannerApi(),
            getNewsApi(),
            getViewApi(formattedDate),
            getDownloadTotalApi(formattedDate)
        ]);
        setCategory(response);
        setBanner(responseBanner);
        setNews(responseNews)
        setView(responseView);
        setTotalDownLoad(responseTotal);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalItems = 100; // Example total items for percentage calculation

    const categoryPercentage = (category.length / totalItems) * 100;
    const newsPercentage = (news.length / totalItems) * 100;
    const bannerPercentage = (banner.length / totalItems) * 100;

    //console.log("totalDownload", totalDownload);
    return (
        <Sidebar>
            <div className='mt-5'>
                <div className='w-full h-[180px] rounded-lg'>
                    <img
                        src={announceImg}
                        alt=""
                        className='h-full w-full object-cover rounded-lg'
                    />
                </div>
                <div className='xl:grid xl:grid-cols-12 lg:flex flex-col mt-10 gap-x-10'>
                    <div className=' col-span-7'>
                        <div className='w-full bg-white rounded-lg mb-5'>
                            <div className='flex justify-between items-center mb-5 px-8 pt-8'>
                                <h4 className='text-[14px] font-medium'>
                                    ຍອດຜູ້ເຂົ້າເບິ່ງເວັບໄຊຕ໌
                                </h4>
                                <p className=' text-[12px]'>
                                    ຈຳນວນທັງໝົດ : <span className=' font-semibold'>{view.length}</span>
                                </p>
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
                            <div className='sm:h-[100px] md:h-[130px] lg:h-[150px] bg-white rounded-lg sm:p-5 lg:p-7 w-full flex flex-col lg:gap-y-7 sm:gap-y-3'>
                                <h6>ບໍລິການທັງໝົດ</h6>
                                <h1 className='sm:text-[20px] lg:text-[28px] font-medium'>
                                    <span className='text-[#00BAAF] sm:text-[20px] lg:text-[28px]'>
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
                            <div className='sm:h-[100px] md:h-[130px] lg:h-[150px] bg-white rounded-lg sm:p-5 lg:p-7 w-full flex flex-col lg:gap-y-7 sm:gap-y-3'>
                                <h6>ຂ່າວສານທັງໝົດ</h6>
                                <h1 className='sm:text-[20px] lg:text-[28px] font-medium'>
                                    <span className='text-[#00BAAF] sm:text-[20px] lg:text-[28px]'>
                                        {news.length}
                                    </span> ລາຍການ
                                </h1>
                                <div className='relative w-full flex items-center h-[4px] rounded-full bg-[#F1F5F9]'>
                                    <div
                                        className='absolute left-0 h-[4px] bg-[#00BAAF] rounded-full'
                                        style={{ width: `${newsPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className='sm:h-[100px] md:h-[130px] lg:h-[150px] bg-white rounded-lg sm:p-5 lg:p-7 w-full flex flex-col lg:gap-y-7 sm:gap-y-3'>
                                <h6>ໂຄສະນາທັງຫມົດ</h6>
                                <h1 className='sm:text-[20px] lg:text-[28px] font-medium'>
                                    <span className='text-[#00BAAF] sm:text-[20px] lg:text-[28px]'>
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
                    <div className='col-span-5 w-full xl:h-full lg:h-[500px] lg:mt-5 xl:mt-0 sm:h-[400px] sm:mt-5'>
                        <div className='w-full h-full bg-white rounded-lg flex flex-col justify-center'>
                            <div className=' flex items-center justify-between p-8'>
                                <h1 className=' text-[18px] font-medium'>
                                    ອັດຕາການດາວໂຫຼດ
                                </h1>
                                <Select
                                    labelInValue
                                    onChange={(e) => setSelectPieChart(e.value)}
                                    defaultValue={{ value: 0, label: 'ລາຍວັນ' }}
                                    style={{ width: 100 }}
                                    options={[
                                        { value: 0, label: 'ລາຍວັນ' },
                                        { value: 1, label: 'ລາຍເດືອນ' },
                                        { value: 2, label: 'ລາຍປີ' },
                                    ]}
                                />
                            </div>
                            {selectPieChart === 0 && <PieCharts totalDownload={totalDownload} />}
                            {selectPieChart === 1 && <PieChartsMonth totalDownload={totalDownload} />}
                            {selectPieChart === 2 && <PieChartsYear totalDownload={totalDownload} />}
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};