import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const ChartBuilder = ({ label, data, labels }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
            },
        },
    };

    return (
        <div>
            <div className='m-4 bg-slate-50 max-h-[600px]'>
                <Bar options={options} data={{
                    labels,
                    datasets: [
                        {
                            label,
                            data,
                            // borderColor: 'rgb(255, 99, 132)',
                            borderColor: '#2c6693',
                            // backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            backgroundColor: '#2c6693',
                        },
                    ],
                }} />
            </div>
        </div>
    )
}

export default ChartBuilder
