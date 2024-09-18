import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Select } from 'antd';
import dayjs from 'dayjs';

export const PieChartsMonth = ({ totalDownload }) => {
    const [selectedMonth, setSelectedMonth] = useState('01'); // Default to January

    // Group data by month
    const dataByMonth = totalDownload?.reduce((acc, item) => {
        const month = dayjs(item?.createdAt).format('MM');
        if (!acc[month]) {
            acc[month] = { banner: 0, news: 0, service: 0 };
        }
        acc[month][item.type]++;
        return acc;
    }, {});

    const handleChange = (value) => {
        setSelectedMonth(value);
    };

    const selectedData = dataByMonth[selectedMonth] || { banner: 0, news: 0, service: 0 };

    const data = [
        { value: selectedData?.service, name: 'Service', itemStyle: { color: '#ff8a7d' } }, // Red
        // { value: selectedData?.news, name: 'News', itemStyle: { color: '#77c6ff' } }, // Blue
        { value: selectedData?.banner, name: 'Banner', itemStyle: { color: '#72e5a7' } }, // Green
    ];

    const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ດາວໂຫຼດ ({d}%)'
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
                name: 'ຈຳນວນດາວໂຫຼດ',
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
                        return ` ${params.name}\n ຈຳນວນ ${params.value} \n ດາວໂຫຼດ (${percent}%)`;
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
                top: '35%',
                style: {
                    text: `${totalAmount} \n ດາວໂຫຼດ`,
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Noto Sans Lao',
                    fill: '#000000',
                }
            },
        ]
    };

    return (
        <div className='w-full h-full bg-white rounded-lg py-4 px-8'>
            {/* <p>{totalDownload.length}</p> */}
            <div className='flex items-center justify-center '>
                <Select
                    value={selectedMonth}
                    onChange={handleChange}
                    style={{ width: 120 }}
                    options={[
                        { value: '01', label: 'January' },
                        { value: '02', label: 'February' },
                        { value: '03', label: 'March' },
                        { value: '04', label: 'April' },
                        { value: '05', label: 'May' },
                        { value: '06', label: 'June' },
                        { value: '07', label: 'July' },
                        { value: '08', label: 'August' },
                        { value: '09', label: 'September' },
                        { value: '10', label: 'October' },
                        { value: '11', label: 'November' },
                        { value: '12', label: 'December' },
                    ]}
                />
            </div>
            <div className='flex flex-col h-full items-center w-full mt-2'>
                <ReactECharts
                    option={option}
                    style={{ height: '80%', width: '100%' }}
                />
            </div>
        </div>
    );
};
