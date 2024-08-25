import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Select } from 'antd';

export const PieCharts = () => {
    const data = [
        { value: 10, name: 'ທຶນກຽມພາສາ 1 ປີ', itemStyle: { color: '#ff8a7d' } }, // Red
        { value: 10, name: 'ທຶນປະລິມຍາຕີ', itemStyle: { color: '#77c6ff' } }, // Blue
        { value: 10, name: 'ທຶນຊັ້ນສູງ', itemStyle: { color: '#72e5a7' } }, // Green
    ];

    const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ລາຍຊື່ ({d}%)'
        },
        legend: {
            bottom: '0%',
            left: 'center',
            textStyle: {
                fontFamily: 'Noto Sans Lao',
            },
        },
        series: [
            {
                name: 'ຈຳນວນລາຍຊື່ຜູ້ສະໝັກ',
                type: 'pie',
                radius: ['30%', '50%'],
                center: ['50%', '40%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10,
                },
                label: {
                    show: true,
                    position: 'bottom',
                    formatter: (params) => {
                        const percent = ((params.value / totalAmount) * 100).toFixed(1);
                        return `${params.name}\n${params.value} ລາຍຊື່ (${percent}%)`;
                    },
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'Noto Sans Lao',
                    lineHeight: 18,
                },
                labelLine: {
                    show: true,
                },
                data: data,
            }
        ],
        graphic: [
            {
                type: 'text',
                left: 'center',
                top: '38%',
                style: {
                    text: `${totalAmount} ລາຍຊື່`,
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Noto Sans Lao',
                    fill: '#000000',  // Matching text color to the image
                }
            },
        ]
    };

    return (
        <div className='w-full h-full bg-white rounded-lg py-8 px-8'>
            <div className=' flex items-center justify-between'>
                <h1 className=' text-[18px] font-medium'>
                    ອັດຕາການດາວໂຫຼດ
                </h1>
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
            <div className='flex flex-col h-full items-center w-full mt-10'>
                <ReactECharts
                    option={option}
                    style={{ height: '80%', width: '100%' }}
                />
            </div>
        </div>
    );
};
