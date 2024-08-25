// import React from 'react'
import React, { PureComponent } from 'react';
import { Select, Space } from 'antd';

import { Sidebar } from '../../components/Sidebar'

// import images
import announceImg from '../../assets/images/webp/announce.webp'
import { AreaCharts } from './charts/AreaCharts';
import { PieCharts } from './charts/PieCharts';



export const Dashboard = () => {
    return (
        <Sidebar>
            <div className='mt-10'>
                <div
                    className='w-full h-[270px] rounded-lg'
                >
                    <img src={announceImg} alt=""
                        className='h-full w-full object-cover rounded-lg'
                    />
                </div>
                <div className='grid grid-cols-12 mt-10 gap-x-10'>
                    <div className='col-span-7'>
                        <div className=' w-full bg-white rounded-lg mb-5'>
                            {/* area chart */}
                            <div className=' flex justify-between items-center mb-5 px-8 pt-8'>
                                <h4 className=' text-[14px] font-medium'>
                                    ຍອດຜູ້ເຂົ້າເບິ່ງເວັບໄຊຕ໌
                                </h4>
                                <Select
                                    labelInValue
                                    defaultValue={{
                                        value: 0,
                                        label: 'ລາຍວັນ',
                                    }}
                                    style={{
                                        width: 100,
                                    }}
                                    // onChange={handleChange}
                                    options={[
                                        {
                                            value: 0,
                                            label: 'ລາຍວັນ',
                                        },
                                        {
                                            value: 1,
                                            label: 'ລາຍເດືອນ',
                                        },
                                        {
                                            value: 2,
                                            label: 'ລາຍປີ',
                                        },
                                    ]}
                                />
                            </div>
                            <AreaCharts />
                        </div>
                        <div className=' flex gap-x-5 w-full'>
                            <div className='h-[150px] bg-white rounded-lg p-7 w-full flex flex-col gap-y-7'>
                                <h6>
                                    ທືນການສືກສາທັງຫມົດທັງຫມົດ
                                </h6>
                                <h1 className=' text-[28px] font-medium'>
                                    <span className=' text-[#00BAAF] text-[28px]'>
                                        10
                                    </span> ລາຍການ
                                </h1>
                                <div className=' relative w-full flex items-center h-[4px] rounded-full bg-[#F1F5F9]'>
                                    <div className=' absolute left-0 w-[20%] h-[4px] bg-[#00BAAF] rounded-full'></div>
                                </div>
                            </div>
                            <div className='h-[150px] bg-white rounded-lg p-7 w-full flex flex-col gap-y-7'>
                                <h6>
                                    ໂຄສະນາທັງຫມົດ
                                </h6>
                                <h1 className=' text-[28px] font-medium'>
                                    <span className=' text-[#00BAAF] text-[28px]'>
                                        5
                                    </span> ລາຍການ
                                </h1>
                                <div className=' relative w-full flex items-center h-[4px] rounded-full bg-[#F1F5F9]'>
                                    <div className=' absolute left-0 w-[10%] h-[4px] bg-[#00BAAF] rounded-full'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-5 w-full h-full'>
                        <div className=' w-full h-full bg-white rounded-lg flex items-center justify-center'>
                            <PieCharts />
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}
