import React, { useEffect, useState } from 'react';
import { Empty, Skeleton } from 'antd';
import { Switch } from 'antd';
import { useSpring, animated } from '@react-spring/web';

// image imports
import card1 from '../../../assets/images/webp/post1.webp';
import card2 from '../../../assets/images/webp/post2.webp';
import card3 from '../../../assets/images/webp/post3.webp';
import card4 from '../../../assets/images/webp/post4.webp';
import card5 from '../../../assets/images/webp/post5.webp';
import card6 from '../../../assets/images/webp/post6.webp';
import card7 from '../../../assets/images/webp/post7.webp';
import card8 from '../../../assets/images/webp/post8.webp';
import { delAboutApi, getAboutApi } from '../../../api/about';
import Swal from 'sweetalert2';
import { formatDate } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const AboutList = ({ filteredDates, cDataID }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [aboutData, setAboutData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getAboutApi();
            setAboutData(response);
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
        fetchData();
    }, []);

    const Springs = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 300, friction: 20 }
    });

    const deleteAbout = async (id) => {
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
                const response = await delAboutApi(id);
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

    const filteredData = filteredDates && filteredDates.length === 2 ?
        aboutData.filter(item =>
            new Date(item.createdAt) >= filteredDates[0] && new Date(item.createdAt) <= filteredDates[1]
        ) :
        aboutData;

    return (
        <div className='mt-5'>
            <div className='flex items-center justify-between'>
                <p className='text-[14px]'>
                    ທັງໝົດ {aboutData.length} ລາຍການ
                </p>
                <button
                    onClick={() => navigate('/aboutManagement/formAddImage')}
                    className="text-white w-[150px] py-2.5 text-[14px] bg-[#01A7B1] rounded-full">
                    ເພີ່ມຮູບພາບກ່ຽວກັບເຮົາ
                </button>
            </div>
            <hr className='mt-3 mb-6 border border-[#D9D9D9]' />
            <div className='grid grid-cols-12 sm:gap-5 xl:gap-10'>
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton.Button key={index} active style={{ width: '100%', height: 285 }} />
                    ))
                ) : (
                    filteredData.map((card, index) => (
                        <animated.div
                            key={index}
                            className='relative h-[285px] xl:w-full lg:w-[210px] rounded-lg shadow-[4px_4px_6px_0px_#B5BABE40] hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:scale-125 duration-300 cursor-pointer bg-white 
                            xl:col-span-3 lg:col-span-4 sm:col-span-6'
                            style={{ ...Springs }}
                        >
                            <img
                                src={card.images[0]}
                                alt={card.title}
                                className='w-full h-[200px] rounded-t-lg object-cover'
                            />
                            <div className='flex flex-col gap-y-1 py-2 px-3'>
                                <h4 className="text-[16px] leading-7 font-medium break-words text-ellipsis text-wrap overflow-hidden line-clamp-2">
                                    {card.title}
                                </h4>
                            </div>
                            <div className='absolute bottom-0 left-0 right-0 flex flex-col gap-y-2 p-3'>
                                <div className='flex items-center justify-between'>
                                    <span>
                                        {formatDate(card.createdAt)}
                                    </span>
                                    <div className='flex items-center gap-x-3'>
                                        <button
                                            onClick={() => deleteAbout(card.id)}
                                            className='w-[45px] bg-[#F87171] text-white rounded-full text-[10px] py-1'>
                                            ລົບ
                                        </button>
                                        <button
                                            onClick={() => navigate(`/aboutManagement/FormEditAbout/${card.id}`)}
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
