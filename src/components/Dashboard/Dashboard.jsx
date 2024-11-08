import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeartPulse, faIndustry, faUsers } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Statistical from "../Statistical/Statistical";
import LineChart  from "../LineChart/LineChart";
import { useAnnouncement } from "../../contexts/Announcement";

function Dashboard(){
    const [userTraining , setUserTraining] = useState([]);
    const [employeeWorking , setEmployeeWorking] = useState();
    const [purchaseOder , setPurchaseOder] = useState();
    const { setError , setMessage } = useAnnouncement();

    useEffect(()=>{
        axios.get("http://localhost:8080/Backend/user/training")
            .then(
                response=>{
                    if(response.status >= 200 && response.status < 300){
                        if(response.warning){

                        }
                        setUserTraining(response.data.success);
                    }
                }).catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
            });
    },[setError , setMessage])

    // useEffect(()=>{
    //     axios.get("http://localhost:8080/Backend/employee/working")
    //         .then(
    //             response=>{
    //                 if(response.status >= 200 && response.status < 300){
    //                     setEmployeeWorking(response.data.success);
    //                 }
    //             }).catch(error => {
    //                 setError(true);
    //                 setMessage(error.response.data.error);
    //         });
    // },[setError , setMessage])

    useEffect(() => {
        // Hàm tìm cookie dựa trên tên
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
    
        // Kiểm tra nếu người dùng đã đăng nhập (có JWT)
        const isLogin = findCookie("jwt");
        if (isLogin) {
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
    
            // Gửi yêu cầu với JWT trong header
            axios.get("http://localhost:8080/Backend/employee/working", { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setEmployeeWorking(response.data.success);
                    }
                }).catch(error => {
                    setError(true);
                    setMessage(error.response?.data?.error || "Có lỗi xảy ra trong quá trình lấy dữ liệu");
                });
        } else {
            setError(true);
            setMessage("Người dùng chưa đăng nhập");
        }
    }, [setError, setMessage]);
    

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
            axios.get("http://localhost:8080/Backend/order/purchase/get_unconfirm", { headers: headers 
            }).then(response => {
                if(response.status >= 200 && response.status < 300){
                    setPurchaseOder(response.data.orders);
                }else{
                    throw new Error("Lấy thông tin đơn hàng thất bại!");
                }
            }).catch(error => {
                setError(true);
                setMessage(error.response.data.error);
            });
        
}
    },[setError , setMessage])

    return(
        <div className={style["wrap-content"]}>
            <div className={style["User-training"]}>
                <FontAwesomeIcon icon={faHeartPulse} />
                <h1>Đang tập</h1>
                <p>{userTraining ? userTraining.length : 0} Khách hàng</p>
            </div>
            <div className={style["employee"]}>
                <FontAwesomeIcon icon={faUsers} />
                <h1>Nhân viên</h1>
                <p>{employeeWorking ? employeeWorking.length : 0} Đang online</p>
            </div>
            <div className={style["purchaseOder"]}>
                <FontAwesomeIcon icon={faCartShopping} />
                <h1>Đơn hàng chưa xử lý</h1>
                <p> {purchaseOder ? purchaseOder.length : 0} Đơn hàng</p>
            </div>
            <div className={style["statistical"]}>
                
                {/* <h1><FontAwesomeIcon icon={faIndustry} />Thống kê lượng người tham gia tập</h1> */}
                {/* <Statistical /> */}
                <LineChart/>
            </div>

            
        </div>  
    );
}

export default Dashboard;