import React from "react";
import Chart from "react-apexcharts";

function DonutChart({ data }) {
  const options = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false, // Ẩn thanh công cụ
      },
    },
    labels: data.labels,
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
    },
    colors: ['#FF4560', '#00E396', '#FEB019', '#008FFB'],
  };

  return <Chart options={options} series={data.series} type="donut" height={350} />;
}

export default DonutChart;
