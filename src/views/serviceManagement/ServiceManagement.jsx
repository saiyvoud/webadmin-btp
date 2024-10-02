import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Sidebar } from '../../components/Sidebar';
import { Empty, Skeleton } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useServiceStore from '../../store/useServiceStore';
import { formatDate } from '../utils';

export const ServiceManagement = () => {
    const navigate = useNavigate();
    const { loading, cardData, tabList, tabActive, setTabActive, fetchData, fetchDataTab, deleteService } = useServiceStore();

    useEffect(() => {
        fetchData();
        fetchDataTab();
    }, [fetchData, fetchDataTab]);

    const filteredData = tabActive === 'all'
        ? cardData
        : cardData.filter(card => card.category_id === tabActive);

    const tabContentAnimation = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 300 },
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'ຢືນຢັນການລົບ',
            text: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບລາຍການນີ້?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ຢືນຢັນ',
            cancelButtonText: 'ຍົກເລີກ',
        });

        if (result.isConfirmed) {
            deleteService(id, fetchData);
            Swal.fire('ລົບສຳເລັດ!', 'ລາຍການຖືກລົບອອກແລ້ວ.', 'success');
        }
    };

    return (
        <Sidebar>
            <div className='sm:my-5 lg:my-10'>
                <div className='w-full rounded-lg bg-white p-3 lg:p-6 flex items-center justify-between'>
                    <ul className='xl:grid xl:grid-cols-12 xl:gap-x-5 sm:grid sm:grid-cols-12 sm:gap-2'>
                        {loading ? (
                            <div className="col-span-12">
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </div>
                        ) : (
                            tabList.map((list, index) => (
                                <li
                                    key={index}
                                    onClick={() => setTabActive(list.id)}
                                    className={`sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-3 ${tabActive === list.id ? 'bg-[#01A7B1] text-white border-2 border-transparent' : 'border-2 border-[#01A7B1] text-[#01A7B1]'} px-2 md:w-[120px] lg:w-[150px] md:h-[45px] xl:h-fit xl:w-full text-center flex items-center justify-center lg:px-4 py-1 xl:py-1.5 rounded-full text-[10px] md:text-[12px] cursor-pointer duration-300`}
                                >
                                    {list.name}
                                </li>
                            ))
                        )}
                    </ul>
                    <button onClick={() => navigate('/serviceManagement/formAddCard')}
                        className='bg-[#01A7B1] rounded-full px-7 py-2 text-white text-[12px] lg:text-[14px]'>
                        ເພີ່ມທຶນ +
                    </button>
                </div>

                <div className={`lg:mt-10 bg-white rounded-lg py-10 px-4 lg:px-5 xl:px-8${filteredData.length < 4 ? filteredData.length === 0 ? 'h-[700px] bg-white' : 'sm:mt-5   h-full md:h-screen' : 'mt-10 bg-white rounded-lg py-10 px-8'} `}>
                    <p className='text-[14px] mb-3 text-[#9CA3AF]'>
                        ທັງໝົດ {filteredData.length} ລາຍການ
                    </p>
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : filteredData.length === 0 ? (
                        <div className=' w-full h-full flex items-center justify-center'>
                            <Empty description="ບໍ່ມີຂໍ້ມູນ" />
                        </div>
                    ) : (
                        <animated.div style={tabContentAnimation} className='grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-2 sm:gap-3 lg:gap-4 xl:gap-7'>
                            {filteredData.map((card, index) => (
                                <div key={index} className='md:h-[310px] sm:h-[280px] sm:w-[180px] md:w-full relative rounded-lg shadow-[4px_4px_6px_0px_#B5BABE40] border-2 border-[#00BAAF80]/50'>
                                    <img src={`https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${card.image}`} alt=""
                                        className='object-cover w-full sm:h-[170px] md:h-[190px] rounded-t-lg' />
                                    <div className='flex flex-col py-2 xl:px-5 sm:px-2'>
                                        <h4 className='text-[16px] font-medium leading-6 overflow-hidden text-ellipsis line-clamp-2 break-words'>
                                            {card.title}
                                        </h4>
                                        <p className='text-[#6B7280] overflow-hidden text-ellipsis line-clamp-2 break-words'>
                                            {card.description}
                                        </p>
                                        <div className='flex items-center justify-between absolute left-0 right-0 bottom-2 px-2 xl:px-5'>
                                            <span>{formatDate(card.createdAt)}</span>
                                            <div className='flex items-center sm:gap-x-1 xl:gap-x-3'>
                                                <button onClick={() => handleDelete(card.id)}
                                                    className='md:w-[45px] sm:w-[40px] bg-[#F87171] text-white rounded-full text-[10px] py-1'>
                                                    ລົບ
                                                </button>
                                                <button onClick={() => navigate(`/serviceManagement/formEditCard/${card.id}`)}
                                                    className='md:w-[45px] sm:w-[40px] bg-[#4ADE80] text-white rounded-full text-[10px] py-1'>
                                                    ແກ້ໄຂ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </animated.div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
};
