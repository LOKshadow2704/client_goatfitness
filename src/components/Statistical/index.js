import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import Chart from "react-apexcharts";
import styles from './style.module.css'; // Đảm bảo import đúng tệp CSS

function Statistical() {
  const { setError, setMessage, setLocation, setLink } = useAnnouncement();
  const [data, setData] = useState({
    series: [{ name: 'Số lượt tập theo tháng', data: [] }],
    categories: [],
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
      axios.get("http://localhost:88/Backend/employee/statistical", { headers: headers })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            const responseData = response.data.success;
            const categories = responseData.map(item => item.Thang);
            const seriesData = responseData.map(item => item.SoLanDangNhap);
            setData({
              series: [{ name: 'Số lượt tập theo tháng', data: seriesData }],
              categories,
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
  }, [setError, setMessage, setLocation, setLink]);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '40px',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.categories,
      axisBorder: {
        color: '#e0e0e0',
      },
      axisTicks: {
        color: '#e0e0e0',
      },
      labels: {
        style: {
          colors: '#666',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
        style: {
          colors: '#666',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ['#00E396'],
  };

  return (
    <div className={styles.statistical}>
      <Chart options={options} series={data.series} type="bar" height={350} />
    </div>
  );
}

export default Statistical;
