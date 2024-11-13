import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUserGear, faCamera } from "@fortawesome/free-solid-svg-icons";
import AccountInfo from "../../components/AccountInfo/AccountInfo";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import Loading from "../../components/Loading/Loading";
import { useAnnouncement } from "../../contexts/Announcement";

function AccountSetting({ changeForm }) {
  const [currentMenu, setCurrentMenu] = useState('info');
  const [userData, setUserData] = useState();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();
  const [setRefresh] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadToImgur(file);
    }
  };

  const isImageValid = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadToImgur = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    const validExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setLoading(false);
      setError(true);
      setMessage('File được chấp nhận JPG, JPEG, PNG.');
      return;
    }

    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxFileSize) {
      setLoading(false);
      setError(true);
      setMessage('Kích thước phải nhỏ hơn 10MB');
      return;
    }

    try {
      await isImageValid(file);
      const response = await axios.post('https://api.imgbb.com/1/upload?key=abbbfc4dd8180b09d029902de59a5241', formData);
      const newlink = response.data.data.image.url;
      const jwt = findCookie('jwt');
      const data = { newavt: newlink };
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
        'PHPSESSID': findCookie("PHPSESSID")
      };
      const updateResponse = await axios.put('http://localhost:8080/Backend/user/updateAvt', data, { headers });
      if (updateResponse.status >= 200 && updateResponse.status < 300) {
        setUpdate(!update);
        setSuccess(true);
        setMessage("Thay đổi ảnh đại diện thành công!");
        setLoading(false);
        setRefresh(true);
      } else {
        throw new Error("Thay đổi ảnh đại diện không thành công!");
      }
    } catch (error) {
      setError(true);
      setMessage(error.message);
      setLoading(false);
    }
  };

  const findCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith(name + '=')) {
        return trimmedCookie.substring(name.length + 1);
      }
    }
    return null;
  };

  useEffect(() => {
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie('jwt');
      const option = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt,
          'PHPSESSID': findCookie("PHPSESSID")
        }
      };
      fetch('http://localhost:8080/Backend/user/Info', option)
        .then(response => {
          if (!response.ok) {
            throw new Error('Lỗi server');
          }
          return response.json();
        })
        .then(data => setUserData(data))
        .catch(error => {
          console.error('Lỗi khi đăng xuất', error);
        });
    } else {
      setError(true);
      setMessage("Vui lòng đăng nhập");
      setLocation(true);
      setLink("http://localhost:3000/login");
    }
  }, [update, setError, setMessage, setSuccess, setLocation, setLink]);

  return (
    <>
      {!changeForm && <Header />}
      {loading && <Loading />}
      <div className={style.container}>
        <div className={style.WrapBox}>
          <h2>Cài đặt tài khoản</h2>
          <div className={style.User}>
            <div className={style.menu}>
              {userData && (
                <div className={style.avt}>
                  <img src={userData.avt} alt="avatar" />
                  <label htmlFor="file">
                    <FontAwesomeIcon icon={faCamera} />
                    <p>Thay đổi ảnh</p>
                  </label>
                  <input
                    id="file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
            <div className={style.account_info}>
              <div className={style.links}>
                <Link to="#" onClick={() => setCurrentMenu("info")}>
                  <FontAwesomeIcon icon={faUserGear} />
                  <p>Sửa thông tin</p>
                </Link>
                <Link to="#" onClick={() => setCurrentMenu("resetPW")}>
                  <FontAwesomeIcon icon={faKey} />
                  <p>Đổi mật khẩu</p>
                </Link>
              </div>
              {currentMenu === "info" && userData && (
                <AccountInfo userData={userData} setUpdate={setUpdate} />
              )}
              {currentMenu === "resetPW" && <ResetPassword />}
            </div>
          </div>
        </div>
      </div>
      {!changeForm && <Footer />}
    </>
  );
}

export default AccountSetting;
