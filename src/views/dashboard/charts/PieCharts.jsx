import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Select } from 'antd';

export const PieCharts = ({ totalDownload }) => {
    const [selectPieChart, setSelectPieChart] = useState(0)
    const totalBanner = totalDownload.filter((item) => item.type === "banner").length
    const totalService = totalDownload.filter((item) => item.type === "service").length
    const totalNews = totalDownload.filter((item) => item.type === "news").length
    // console.log("total", total);
    const data = [
        { value: totalService, name: 'Service', itemStyle: { color: '#ff8a7d' } }, // Red
        { value: totalNews, name: 'News', itemStyle: { color: '#77c6ff' } }, // Blue
        { value: totalBanner, name: 'Banner', itemStyle: { color: '#72e5a7' } }, // Green
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
                        return `${params.name}\n${params.value} ດາວໂຫຼດ \n (${percent}%)`;
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
                top: '34%',
                style: {
                    text: `${totalAmount} \n ດາວໂຫຼດ`,
                    fontSize: 18,
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
            <div className='flex flex-col h-full items-center w-full mt-10'>
                <ReactECharts
                    option={option}
                    style={{ height: '80%', width: '100%' }}
                />
            </div>
        </div>
    );
};
