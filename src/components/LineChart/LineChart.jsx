import React, { useEffect, useState, useRef } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import { Card, CardContent, Typography } from "@mui/material";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function LineChart() {
  const { setError, setMessage, setLocation, setLink } = useAnnouncement();
  const chartRef = useRef(null);  // Sử dụng ref để theo dõi biểu đồ
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số lượt tập theo tháng',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const findCookie = (name) => {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    };

    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie('jwt');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
        'PHPSESSID': findCookie("PHPSESSID")
      };

      axios.get("http://localhost:8080/Backend/employee/statistical", { headers: headers })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            const responseData = response.data.success;
            const labels = responseData.map(item => item.Thang);
            const dataValues = responseData.map(item => item.SoLanDangNhap);
            setData({
              labels: labels,
              datasets: [
                {
                  label: 'Số lượt tập theo tháng',
                  data: dataValues,
                  borderColor: 'rgba(75,192,192,1)',
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  fill: true,
                  tension: 0.4,
                },
              ],
            });
          } else {
            throw new Error("Lấy thông tin thống kê thất bại!");
          }
        }).catch(error => {
          setError(true);
          setMessage(error.response.data.error);
        });
    } else {
      setError(true);
      setMessage("Vui lòng đăng nhập");
      setLocation(true);
      setLink("http://localhost:3000/login");
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();  // Hủy biểu đồ khi component unmount
      }
    };
  }, [setError, setMessage, setLocation, setLink]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Thống kê số lượt tập theo tháng (Line Chart)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardContent>
        {/* <Typography variant="h5" component="div">
          Thống kê số lượt tập theo tháng
        </Typography> */}
        <Line ref={chartRef} data={data} options={options} />
      </CardContent>
    </Card>
  );
}

export default LineChart;
