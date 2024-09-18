import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Select } from 'antd';

export const PieChartsYear = ({ totalDownload }) => {
    const years = Array.from({ length: 11 }, (_, i) => 2018 + i); // Years from 2018 to 2028

    const getYearlyData = (year) => {
        const yearData = totalDownload?.filter((item) => {
            const itemYear = new Date(item?.createdAt).getFullYear();
            return itemYear === year;
        });

        const totalBanner = yearData?.filter((item) => item?.type === 'banner').length;
        const totalService = yearData?.filter((item) => item?.type === 'service').length;
        const totalNews = yearData?.filter((item) => item?.type === 'news').length;

        return [
            { value: totalService, name: 'Service', itemStyle: { color: '#ff8a7d' } }, // Red
            // { value: totalNews, name: 'News', itemStyle: { color: '#77c6ff' } }, // Blue
            { value: totalBanner, name: 'Banner', itemStyle: { color: '#72e5a7' } }, // Green
        ];
    };

    const [selectedYear, setSelectedYear] = useState(years[0]);

    const handleYearChange = (value) => {
        setSelectedYear(value);
    };

    const data = getYearlyData(selectedYear);

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
                name: `ຈຳນວນລາຍຊື່ປະຈຳປີ ${selectedYear}`,
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
                    lineHeight: 16,
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
            <div className='flex flex-col h-full items-center w-full mt-0'>
                <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: 120, marginBottom: 10 }}
                >
                    {years.map((year) => (
                        <Select.Option key={year} value={year}>
                            {year}
                        </Select.Option>
                    ))}
                </Select>
                <ReactECharts
                    option={option}
                    style={{ height: '80%', width: '100%' }}
                />
            </div>
        </div>
    );
};
