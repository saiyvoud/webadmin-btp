import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Sidebar } from '../../components/Sidebar';
import { Skeleton } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { deleteServiceApi, getService } from '../../api/serivce';
import { getServiceApi } from '../../api/serviceInfo';
import { formatDate } from '../utils';

export const ServiceManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState([]);
    const [tabActive, setTabActive] = useState('all');
    const [tabList, setTabList] = useState([]);

    const fetchDataTab = async () => {
        setLoading(true);
        try {
            const response = await getServiceApi();
            if (!response) {
                throw new Error('No response from API');
            }
            setTabList([{ id: 'all', name: 'ທັງໝົດ' }, ...response]);
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
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getService();
            if (!response) {
                throw new Error('No response from API');
            }
            setCardData(response);
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
        fetchDataTab();
    }, []);

    const filteredData = tabActive === 'all'
        ? cardData
        : cardData.filter(card => card.category_id === tabActive);

    const tabContentAnimation = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 300 },
    });

    const deleteService = async (id) => {
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
                const response = await deleteServiceApi(id);
                if (response) {
                    Swal.fire(
                        'ລົບສຳເລັດ!',
                        'ລາຍການຖືກລົບອອກແລ້ວ.',
                        'success'
                    );
                    fetchData();
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

    return (
        <Sidebar>
            <div className='my-10'>
                <div className='w-full rounded-lg bg-white p-6 flex items-center justify-between'>
                    <ul className='flex items-center gap-x-5'>
                        {tabList.map((list, index) => (
                            <li
                                key={index}
                                onClick={() => setTabActive(list.id)}
                                className={`${tabActive === list.id ? 'bg-[#01A7B1] text-white border-2 border-transparent' : 'border-2 border-[#01A7B1] text-[#01A7B1]'} px-6 py-2 rounded-full text-[14px] cursor-pointer duration-300`}
                            >
                                {list.name}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/serviceManagement/formAddCard')}
                        className='bg-[#01A7B1] rounded-full px-7 py-2 text-white text-[16px]'>
                        ເພີ່ມທຶນ +
                    </button>
                </div>

                <div className={`${filteredData.length < 4 ? 'mt-10 bg-white rounded-lg py-10 px-8 h-screen' : 'mt-10 bg-white rounded-lg py-10 px-8'} `}>
                    <p className='text-[14px] mb-3 text-[#9CA3AF]'>
                        ທັງໝົດ {filteredData.length} ລາຍການ
                    </p>
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : (
                        <animated.div style={tabContentAnimation} className='grid grid-cols-4 gap-7'>
                            {
                                filteredData.map((card, index) => (
                                    <div key={index}
                                        className='h-[310px] relative rounded-lg shadow-[4px_4px_6px_0px_#B5BABE40] border-2 border-[#00BAAF80]/50'
                                    >
                                        <img src={card.image} alt=""
                                            className='object-cover w-full h-[190px] rounded-t-lg'
                                        />
                                        <div className='flex flex-col py-2 px-5'>
                                            <h4 className='text-[16px] font-medium leading-6 overflow-hidden text-ellipsis line-clamp-2 break-words '>
                                                {card.title}
                                            </h4>
                                            <p className='text-[#6B7280] overflow-hidden text-ellipsis line-clamp-2 break-words'>
                                                {card.description}
                                            </p>
                                            <div className='flex items-center justify-between absolute left-0 right-0 bottom-2 px-5'>
                                                <span>
                                                    {formatDate(card.createdAt)}
                                                </span>
                                                <div className='flex items-center gap-x-3'>
                                                    <button onClick={() => deleteService(card.id)}
                                                        className='w-[45px] bg-[#F87171] text-white rounded-full text-[10px] py-1'>
                                                        ລົບ
                                                    </button>
                                                    <button onClick={() => navigate(`/serviceManagement/formEditCard/${card.id}`)}
                                                        className='w-[45px] bg-[#4ADE80] text-white rounded-full text-[10px] py-1'>
                                                        ແກ້ໄຂ
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ss */}
                                    </div>
                                ))
                            }
                        </animated.div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
};