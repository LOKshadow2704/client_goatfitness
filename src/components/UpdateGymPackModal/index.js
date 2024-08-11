import React, { useState } from "react";
import style from "./style.module.css";
// import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function UpdateGymPackModal({ data ,setShowModal}) {
    const { setError ,setMessage ,setSuccess } = useAnnouncement();
    const [formData, setFormData] = useState({
        IDGoiTap: data.IDGoiTap,
        TenGoiTap: "",
        ThoiHan: "",
        Gia: ""
    });

    const checkFormData = (formData) => {
        let nonEmptyFieldsCount = 0;
        for (const key in formData) {
            if (formData[key] !== "") {
                nonEmptyFieldsCount++;
            }
            if (nonEmptyFieldsCount >= 2) {
                return true;
            }
        }
        return false;
    };

    const removeEmptyFields = (formData) => {
        const filteredFormData = {};
        for (const key in formData) {
            if (formData[key] !== "") {
                filteredFormData[key] = formData[key];
            }
        }
        return filteredFormData;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
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


    const handleSubmit = async  (e) => {
        e.preventDefault();
        const isLogin = findCookie("jwt");
        if(isLogin){
            //Kiểm tra rỗng
            if(checkFormData(formData)){
                const cleanData = removeEmptyFields(formData);
                const jwt = findCookie('jwt');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt,
                    'PHPSESSID': findCookie("PHPSESSID")
                };
                // Gửi đi
                axios.put('http://localhost:88/Backend/gympack/update',  cleanData, { headers: headers 
                }).then(response => {
                    if(response.status >= 200 && response.status < 300){
                        setSuccess(true);
                        setMessage("Cập nhật thành công");
                        setShowModal(false);
                    }else{
                        throw new Error("Lấy thông tin thất bại");
                    }
                }).catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                });
            }else{
                setError(true);
                setMessage("Không có thay đổi!");
                return;
            }
        }
    }

    return (
        <div className={style.modal}><div className={style.wrap_content}>
        <IconButton onClick={() => setShowModal(false)} style={{ alignSelf: 'flex-end' }}>
                    <CloseIcon />
                </IconButton>
        <h1>Cập nhật gói tập</h1>
        <form className={style.updateForm} onSubmit={handleSubmit}>
            <div className={style.formGroup}>
                <label htmlFor="TenGoiTap">Tên gói tập:</label>
                <input
                    type="text"
                    id="TenGoiTap"
                    name="TenGoiTap"
                    defaultValue={data.TenGoiTap}
                    onChange={handleChange}
                />
            </div>
            <div className={style.formGroup}>
                <label htmlFor="ThoiHan">Thời gian hết hạn (ngày) :</label>
                <input
                    type="number"
                    id="ThoiHan"
                    name="ThoiHan"
                    defaultValue={data.ThoiHan}
                    onChange={handleChange}
                />
            </div>
            <div className={style.formGroup}>
                <label htmlFor="Gia">Giá:</label>
                <input
                    type="number"
                    id="Gia"
                    name="Gia"
                    defaultValue={data.Gia}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Lưu</button>
        </form>
        </div></div>
        
    );
};

export default UpdateGymPackModal;
