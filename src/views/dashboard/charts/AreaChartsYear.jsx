import React from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';

export const AreaChartsYear = ({ view }) => {
    // Define the range of years
    const startYear = 2018;
    const endYear = 2028;

    // Initialize an object to count visits for each year
    const visitCounts = {};
    for (let year = startYear; year <= endYear; year++) {
        visitCounts[year] = 0;
    }

    // Populate the visitCounts object based on the view data
    view?.forEach(item => {
        const year = dayjs(item.createdAt).year();
        if (year >= startYear && year <= endYear) {
            visitCounts[year]++;
        }
    });

    // Prepare data for the chart
    const seriesData = [
        {
            name: 'จำนวนผู้เข้าชม',
            data: Object.keys(visitCounts).map(year => visitCounts[year])
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
            categories: Object.keys(visitCounts),
            labels: {
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
                <ReactApexChart options={options} series={seriesData} type="area" height={350} />
            </div>
        </div>
    );
};
