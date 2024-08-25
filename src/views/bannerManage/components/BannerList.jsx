import React, { useEffect, useState } from 'react';
import { Switch, Skeleton } from 'antd';
import { useSpring, animated } from '@react-spring/web';
import { delBannerApi, getBannerApi, upadteSwitchBannerApi } from '../../../api/banner';
import Swal from 'sweetalert2';
import { formatDate } from '../../utils';
import dayjs from 'dayjs'; // import dayjs to handle date comparison
import { useNavigate } from 'react-router-dom';

export const BannerList = ({ dateRange }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [bannerData, setBannerData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getBannerApi();
            if (!response) {
                throw new Error("No response from API");
            }
            setBannerData(response);
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
        console.log(bannerData);
    }, []);

    const filteredData = dateRange
        ? bannerData.filter(item => {
            const createdAt = dayjs(item.createdAt);
            return createdAt.isAfter(dateRange[0]) && createdAt.isBefore(dateRange[1]);
        })
        : bannerData;

    const springs = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 300, friction: 20 },
    });

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
                const response = await delBannerApi(id);
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

    const handleChangeSwitch = async (id, value) => {
        const response = await upadteSwitchBannerApi(id, value);
        if (response) {
            Swal.fire(
                'ເຊື່ອງສຳເລັດ!',
                'ລາຍການຖືກເຊື່ອງແລ້ວ.',
                'success'
            );
            await fetchData();
        }
    };

    return (
        <div className='mt-10'>
            <p className='text-[14px]'>
                ທັງໝົດ {filteredData.length} ລາຍການ
            </p>
            <hr className='mt-3 mb-10 border border-[#D9D9D9]' />
            <div className='grid grid-cols-12 gap-10'>
                {loading ? (
                    // Skeleton Loading State
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-[330px] col-span-3">
                            <Skeleton active avatar />
                        </div>
                    ))
                ) : (
                    filteredData.map((item, index) => (
                        <animated.div
                            key={index}
                            className="h-[330px] relative rounded-lg col-span-3 shadow-[4px_4px_6px_0px_#B5BABE40] bg-white"
                            style={{ ...springs }}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-[200px] rounded-t-lg object-cover"
                            />
                            <div className="flex flex-col gap-y-1 pt-2 px-5">
                                <h4 className="text-[16px] font-medium">
                                    {item.title}
                                </h4>
                                <p className="text-[#6B7280]">
                                    {item.detail} Lorem ipsum dolor sit amet
                                </p>
                                <span>
                                    {formatDate(item.createdAt)}
                                </span>
                            </div>
                            <div className="flex w-full absolute bottom-3 items-center justify-between px-5">
                                <Switch
                                    onChange={(value) => handleChangeSwitch(item.id, value)}
                                    defaultChecked={item.isPublished}
                                    className="custom-switch"
                                />
                                <div className="flex items-center gap-x-3">
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="w-[45px] bg-[#F87171] text-white rounded-full text-[10px] py-1"
                                    >
                                        ລົບ
                                    </button>
                                    <button
                                        onClick={() => navigate(`/bannerManagement/formEditBanner/${item.id}`)}
                                        className="w-[45px] bg-[#4ADE80] text-white rounded-full text-[10px] py-1"
                                    >
                                        ແກ້ໄຂ
                                    </button>
                                </div>
                            </div>
                        </animated.div>
                    ))
                )}
            </div>
        </div>
    );
};
