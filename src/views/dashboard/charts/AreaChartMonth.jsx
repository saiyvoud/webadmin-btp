import React from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';

export const AreaChartMonth = ({ view }) => {
    // Define months of the year
    const monthsOfYear = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Initialize an object to count visits for each month of the year
    const visitCounts = monthsOfYear.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
    }, {});

    // Populate the visitCounts object based on the view data
    view.forEach(item => {
        const month = dayjs(item.createdAt).format('MMM');
        if (visitCounts.hasOwnProperty(month)) {
            visitCounts[month]++;
        }
    });

    // Prepare data for the chart
    const seriesData = monthsOfYear.map(month => ({
        x: month,
        y: visitCounts[month]
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
            categories: monthsOfYear,
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