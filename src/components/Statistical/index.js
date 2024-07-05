import React, { useEffect, useState } from "react";
// import style from "./style.module.css";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function Statistical(){
  const { setError ,setMessage , setLocation , setLink} = useAnnouncement();
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số lượt tập theo tháng',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });
  
  
  useEffect(()=>{
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
      if(isLogin){
          const jwt = findCookie('jwt');
          const headers = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt,
              'PHPSESSID': findCookie("PHPSESSID")
          };
          axios.get("http://localhost:88/Backend/employee/statistical", { headers: headers 
          }).then(response => {
              if(response.status >= 200 && response.status < 300){
                const responseData = response.data.success;
                const labels = responseData.map(item => item.Thang);
                const dataValues = responseData.map(item => item.SoLanDangNhap);
                setData({
                  labels: labels,
                  datasets: [
                    {
                      label: 'Số lượt tập theo tháng',
                      data: dataValues,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: 'rgba(75,192,192,1)',
                      borderWidth: 1,
                    },
                  ],
                });
              }else{
                  throw new Error("Lấy thông tin đơn hàng thất bại!");
              }
          }).catch(error => {
              setError(true);
              setMessage(error.response.data.error);
          });
      }else{
          setError(true);
          setMessage("Vui lòng đăng nhập");
          setLocation(true);
          setLink("http://localhost:3000/login");
      }
  },[setError ,setMessage , setLocation , setLink])
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Bar Chart Example',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
    return(
        <Bar data={data} options={options} />
    )
}

export default Statistical;