// NewsList.js
import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import useNewsStore from '../../../store/newsStore'; // Import Zustand store
import { formatDate } from '../../utils';

export const NewsList = ({ dateRange }) => {
    const { newsItem, loading, fetchNews } = useNewsStore(); // Use Zustand store
    const [filteredNews, setFilteredNews] = React.useState([]);
    const navigate = useNavigate();
    const [startDate, endDate] = dateRange || [];

    // Define animation using react-spring
    const springs = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 300, friction: 20 },
    });

    // Fetch data from Zustand store
    useEffect(() => {
        fetchNews(); // Call fetchNews from the store
    }, [fetchNews]);

    // Filter news based on date range
    useEffect(() => {
        filterNews();
    }, [startDate, endDate, newsItem]);

    const filterNews = () => {
        if (startDate && endDate) {
            const filtered = newsItem.filter(news => {
                const newsDate = new Date(news.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return newsDate >= start && newsDate <= end;
            });
            setFilteredNews(filtered);
        } else {
            setFilteredNews(newsItem);
        }
    };

    return (
        <div className='xl:mt-10 sm:mt-5 '>
            <p className='text-[14px]'>
                ທັງໝົດ {filteredNews?.length} ລາຍການ
            </p>
            <hr className='mt-3 xl:mb-10 sm:mb-5 border border-[#D9D9D9]' />
            <div className='grid grid-cols-12 sm:gap-3 md:gap-5 lg:gap-4 xl:gap-5'>
                {loading ? (
                    // Skeleton Loading State
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className='h-[330px] sm:col-span-2 lg:col-span-3'>
                            <Skeleton active avatar />
                        </div>
                    ))
                ) : (
                    filteredNews?.map((news, index) => (
                        <animated.div
                            key={index}
                            className=' sm:col-span-6 lg:col-span-4 xl:col-span-3'
                            style={springs}
                        >
                            <div className='relative h-[290px] md:h-[300px] lg:h-[310px] md:w-[250px] lg:w-[220px] xl:w-full rounded-lg shadow-[4px_4px_6px_0px_#B5BABE40] border-2 border-[#00BAAF80]/50 flex flex-col'>
                                <img
                                    src={`https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${news?.cover_image}` || 'fallback-image-url'}
                                    alt={news?.title || 'News Image'}
                                    className='w-full sm:h-[170px] lg:h-[190px] rounded-t-lg object-cover'
                                />
                                <div className='flex flex-col gap-y-0 py-2 sm:px-2 lg:px-3 xl:px-5 flex-grow'>
                                    <h4 className='text-[16px] leading-6 font-medium text-ellipsis break-words line-clamp-2 mb-1'>
                                        {news?.title}
                                    </h4>
                                    <p className='text-[#6B7280] line-clamp-2'>
                                        {news.detail}
                                    </p>
                                </div>
                                <div className='p-2 lg:px-2 xl:px-5 pt-0'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-sm'>
                                            {formatDate(news?.createdAt)}
                                        </span>
                                        <div className='flex items-center sm:gap-x-1.5 lg:gap-x-1 xl:gap-x-3'>
                                            <button
                                                onClick={() => deleteItem(news?.id)}
                                                className='sm:w-[45px] lg:w-[45px] bg-[#F87171] text-white rounded-full text-[10px] py-1'>
                                                ລົບ
                                            </button>
                                            <button
                                                onClick={() => navigate(`/newsManagement/formEditCardNews/${news?.id}`)}
                                                className='sm:w-[45px] lg:w-[45px] bg-[#4ADE80] text-white rounded-full text-[10px] py-1'>
                                                ແກ້ໄຂ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </animated.div>
                    ))
                )}
            </div>
        </div>
    );
};
