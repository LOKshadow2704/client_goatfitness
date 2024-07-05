import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUserGear , faUserPen} from "@fortawesome/free-solid-svg-icons";
import AccountInfo from "../../components/AccountInfo";
import ResetPassword from "../../components/ResetPassword";
import Loading from "../../components/Loading";
import { useAnnouncement } from "../../contexts/Announcement";

function AccountSetting({changeForm , setRefresh}){
    const [currentMenu , setCurrentMenu] = useState('info');
    const [userData , setUserData] = useState();
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setError ,setMessage ,setSuccess , setLocation , setLink} = useAnnouncement();
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadToImgur(event.target.files[0]);
        }
    };

    //Kiểm tra hợp lệ
    const isImageValid = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // Hình ảnh hợp lệ
                resolve(true);
            };
            img.onerror = () => {
                // Hình ảnh không hợp lệ
                reject(false);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const uploadToImgur = (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        const validExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            setLoading(false);
            setError(true);
            setMessage('File được chấp nhận JPG, JPEG, PNG .');
            return;
        }

       // Kiểm tra kích thước tệp
       const maxFileSize = 10 * 1024 * 1024; // 10 MB
       if (file.size > maxFileSize) {
        setLoading(false);
        setError(true);
        setMessage('Kích thước phải nhỏ hơn 10MB');
        return;
       }
   
       // Kiểm tra tính toàn vẹn của hình ảnh
       isImageValid(file)
            .then(()=>{
                axios.post('https://api.imgbb.com/1/upload?key=abbbfc4dd8180b09d029902de59a5241', formData)
                .then(response => {
                    const newlink = response.data.data.image.url;
                    const jwt = findCookie('jwt');
                    const data = {
                        newavt: newlink,
                    };
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt,
                        'PHPSESSID': findCookie("PHPSESSID")
                    };
                    axios.put('http://localhost:88/Backend/updateAvt',  data, { headers: headers 
                    }).then(response => {
                        if(response.status >= 200 && response.status < 300){
                            if(update===true){setUpdate(false);}else{setUpdate(true);}
                            setSuccess(true);
                            setMessage("Thay đổi ảnh đại diện thành công!");
                            setLoading(false);
                            setRefresh(true);
                        }else{
                            throw new Error("Thay đổi ảnh đại diện không thành công!");
                        }
                    }).catch(error => {
                        setError(true);
                        setMessage(error);
                    });
                })
                .catch(error => {
                    setError(true);
                    setMessage('Error uploading to Imgur: ', error);
                });
        }).catch(() => {
            // Hình ảnh không hợp lệ
            setError(true);
            setMessage('Hình ảnh không hợp lệ');
        });
        
    };
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
    useEffect(() => {
        const isLogin = findCookie("jwt");
        if(isLogin){
            const jwt = findCookie('jwt');
            const option = {
                method : 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+jwt,
                    'PHPSESSID': findCookie("PHPSESSID")
                }
            }
            fetch('http://localhost:88/Backend/getAccountInfo',option)
                .then(
                    response=>{
                        if(!response.ok){
                            throw new Error('Lỗi server');
                        }else{
                            return response.json();
                        }
                    }
                )
                .then(
                    data =>{
                        const responseData = data;
                        setUserData(responseData);
                    }
                )
                .catch(
                    error => {
                        console.error('Lỗi khi đăng xuất', error);
                    }
                )
                
        }else{
            setError(true);
            setMessage("Vui lòng đăng nhập");
            setLocation(true);
            setLink("http://localhost:3000/login");
        }
      }, [update,setError ,setMessage ,setSuccess , setLocation , setLink]);
    return(
        <>
            {
                !changeForm &&             <Header />
            }
            {loading && (
                    <Loading/>
                )
                }
            <div className={style.container}>
                <div className={style.WrapBox}>
                <h1>Cài đặt tài khoản</h1>
                <div className={style.User}>
                    <div className={style.menu}>
                        {
                             userData && <div className={style.avt}><img src={userData.avt} alt="avatar"/>
                            <label htmlFor="file">
                                <FontAwesomeIcon icon={faUserPen} />
                                <p>Thay đổi ảnh</p>
                            </label>
                            <input 
                                id="file" 
                                type="file" 
                                style={{ display: 'none' }} 
                                onChange={handleFileChange} 
                            />
                             </div>
                        }
                        
                        <Link to="#" onClick={()=>setCurrentMenu("info")}><FontAwesomeIcon icon={faUserGear} /><p>Thông tin</p></Link>
                        <Link to="#" onClick={()=>setCurrentMenu("resetPW")}><FontAwesomeIcon icon={faKey} /><p>Đổi mật khẩu</p></Link>
                    </div>
                    <div className={style.account_info}>
                    {currentMenu === "info" && userData && <AccountInfo 
                        userData={userData} 
                        setUpdate={setUpdate} 
                    />}
                    {currentMenu === "resetPW" && <ResetPassword />}
                    </div>
                </div>
                </div>
            </div>
            {
                !changeForm &&             <Footer />
            }
        </>
    )
}

export default AccountSetting;