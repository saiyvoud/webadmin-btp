import React from 'react';
import ReactApexChart from 'react-apexcharts';

export const AreaCharts = () => {
    const series = [
        {
            name: 'Visitors',
            data: [150, 50, 380, 70, 200, 20, 380, 50]
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
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yaxis: {
            max: 500,
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
        <div className=' px-8'>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="area" height={250} />
            </div>
        </div>
    );
}