import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Swal from 'sweetalert2';
import { Skeleton } from 'antd'; // Import Skeleton from Ant Design

// image imports
import card1 from '../../../assets/images/webp/post1.webp';
import card2 from '../../../assets/images/webp/post2.webp';
import card3 from '../../../assets/images/webp/post3.webp';
import card4 from '../../../assets/images/webp/post4.webp';
import card5 from '../../../assets/images/webp/post5.webp';
import card6 from '../../../assets/images/webp/post6.webp';
import card7 from '../../../assets/images/webp/post7.webp';
import card8 from '../../../assets/images/webp/post8.webp';
import { delNewsApi, getNewsApi } from '../../../api/news';
import { formatDate } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const NewsList = ({ dateRange }) => {
    const [loading, setLoading] = useState(false);
    const [newsItem, setNewsItem] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const navigate = useNavigate();
    const [startDate, endDate] = dateRange || []; // Ensure dateRange is defined

    // Define animation using react-spring
    const springs = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 300, friction: 20 },
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getNewsApi();
            if (!response) {
                throw new Error('No response from API');
            }
            setNewsItem(response);
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
    }, []);

    useEffect(() => {
        filterNews();
    }, [startDate, endDate, newsItem]);

    const deleteItem = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'ຢືນຢັນການລົບ',
                text: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບລາຍການນີ້?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ຢືນຢັນ',
                cancelButtonText: 'ຍົກເລີກ'
            });
            if (result.isConfirmed) {
                const response = await delNewsApi(id);
                if (response) {
                    Swal.fire(
                        'ລົບສຳເລັດ!',
                        'ລາຍການຖືກລົບອອກແລ້ວ.',
                        'success'
                    );
                    fetchData(); // Refresh the data
                } else {
                    throw new Error("Failed to delete");
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ເກີດຂໍ້ຜິດພາດ',
                text: 'ບໍ່ສາມາດລົບລາຍການໄດ້',
            });
            console.error('Error deleting item:', error);
        }
    };

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
        <div className='mt-10'>
            <p className='text-[14px]'>
                ທັງໝົດ {filteredNews.length} ລາຍການ
            </p>
            <hr className='mt-3 mb-10 border border-[#D9D9D9]' />
            <div className='grid grid-cols-12 gap-5'>
                {loading ? (
                    // Skeleton Loading State
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className='h-[330px] col-span-3'>
                            <Skeleton active avatar />
                        </div>
                    ))
                ) : (
                    filteredNews.map((news, index) => (
                        <animated.div
                            key={index}
                            className='h-[330px] rounded-lg object-cover col-span-3 shadow-[4px_4px_6px_0px_#B5BABE40] border-2 border-[#00BAAF80]/50'
                            style={springs}
                        >
                            <img
                                src={news.image || card1} // Use a fallback image if `news.image` is undefined
                                alt={news.title || 'News Image'}
                                className='w-full h-[200px] rounded-t-lg object-cover'
                            />
                            <div className='flex flex-col gap-y-4 py-4 px-5'>
                                <h4 className='text-[16px] font-medium'>
                                    {news.title}
                                </h4>
                                <p className='text-[#6B7280]'>
                                    {news.detail}
                                </p>
                                <div className='flex items-center justify-between'>
                                    <span>
                                        {formatDate(news.createdAt)}
                                    </span>
                                    <div className='flex items-center gap-x-3'>
                                        <button
                                            onClick={() => deleteItem(news.id)}
                                            className='w-[45px] bg-[#F87171] text-white rounded-full text-[10px] py-1'>
                                            ລົບ
                                        </button>
                                        <button
                                            onClick={() => navigate(`/newsManagement/formEditCardNews/${news.id}`)}
                                            className='w-[45px] bg-[#4ADE80] text-white rounded-full text-[10px] py-1'>
                                            ແກ້ໄຂ
                                        </button>
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
