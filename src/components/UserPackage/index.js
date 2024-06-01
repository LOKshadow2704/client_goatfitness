import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";

function UserPackage({setShowModal}) {
    const [data , setData] = useState();

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
            axios.post('http://localhost:88/Backend/PackageGym/UserInfo',  null, { headers: headers 
            }).then(response => {
                if(response.status >= 200 && response.status < 300){
                    setData(response.data);
                    console.log(response.data);
                }
            }).catch(error => {
                alert(error.response.data.error);
                window.location.href = "http://localhost:3000/GymPack";
            });
                
        }
    },[])
    return (
        <div className={style.modal}>
            <div className={style.wrap_content}>
            <h1><FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)}/></h1>
                <h1>Thông tin gói tập của bạn</h1>
                <div className={style.info}>
                    <h1>Tên gói tập: {data && data.info.TenGoiTap}</h1>
                    <span>Ngày đăng ký: {data && data.NgayDangKy}</span>
                    <span>Ngày hết hạn: {data && data.NgayHetHan}</span>
                </div>
                <div className={style.describe}>
                    <table>
                        <thead>
                            <tr><th></th><th>Classic</th><th>Royal</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Không giới hạn thời gian luyện tập</td><td></td><td><FontAwesomeIcon icon={faCircleCheck} /></td>
                            </tr>
                            <tr>
                                <td>Tự do tập luyện tại tất cả câu lạc bộ trong hệ thống GOAT Fitness</td><td><FontAwesomeIcon icon={faCircleCheck} /></td><td><FontAwesomeIcon icon={faCircleCheck} /></td>
                            </tr>
                            <tr>
                                <td>Nước uống miễn phí</td><td><FontAwesomeIcon icon={faCircleCheck} /></td><td><FontAwesomeIcon icon={faCircleCheck} /></td>
                            </tr>
                        </tbody>
                    </table>
               </div>
            </div>
        </div>
    );
};

export default UserPackage;
