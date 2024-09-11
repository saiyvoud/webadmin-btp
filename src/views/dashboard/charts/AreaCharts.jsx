import React from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';

export const AreaCharts = ({ view }) => {
    // Define the days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize an object to count visits for each day of the week
    const visitCounts = daysOfWeek.reduce((acc, day) => {
        acc[day] = 0;
        return acc;
    }, {});

    // Populate the visitCounts object based on the view data
    view?.forEach(item => {
        const dayOfWeek = dayjs(item.createdAt).format('ddd');
        if (visitCounts.hasOwnProperty(dayOfWeek)) {
            visitCounts[dayOfWeek]++;
        }
    });

    // Prepare data for the chart
    const seriesData = daysOfWeek.map(day => ({
        x: day,
        y: visitCounts[day]
    }));

    const series = [
        {
            name: 'ຈຳນວນຄົນເຂົ້າເບິ່ງ',
            data: seriesData
        }
    ];

    const options = {
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: daysOfWeek,
            labels: {
                rotate: -45,
                style: {
                    fontSize: '12px',
                    colors: '#6c757d'
                }
            }
        },
        yaxis: {
            max: Math.max(...Object.values(visitCounts)) + 5, // Adjust max value for the y-axis
            tickAmount: 5
        },
        colors: ['#00E396'],
        grid: {
            show: true,
            borderColor: '#f1f1f1',
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        markers: {
            size: 0
        }
    };

    return (
        <div className='px-8'>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="area" height={250} />
            </div>
        </div>
    );
};
