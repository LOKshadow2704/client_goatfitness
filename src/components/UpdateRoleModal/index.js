import React, { useState } from "react";
import style from "./style.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateRoleModal({ data, setShowModal }) {
    const { setError ,setMessage ,setSuccess , setLocation , setLink} = useAnnouncement();
    const [formData, setFormData] = useState({
        TenDangNhap: data.TenDangNhap,
        IDVaiTro: data.IDVaiTro,
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isLogin = findCookie("jwt");
        if (isLogin) {
            if(formData.TenDangNhap === data.TenDangNhap && formData.IDVaiTro === data.IDVaiTro){
                setError(true);
                setMessage("Không có thay đổi nào cả");
                setShowModal(false);
                return;
            }
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };

            console.log(formData)

            axios.put('http://localhost:88/Backend/admin/update', formData, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setSuccess(true);
                        setMessage("Cập nhật thành công");
                        setShowModal(false);
                    } else {
                        throw new Error("Lấy thông tin thất bại");
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
    };

    return (
        <div className={style.modal}>
            <div className={style.wrap_content}>
                <p>
                    <FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} />
                </p>
                <h1>Cập nhật vai trò</h1>
                <form className={style.updateForm} onSubmit={handleSubmit}>
                    <div className={style.formGroup}>
                        <label htmlFor="TenDangNhap">Tên Đăng nhập:</label>
                        <input
                            type="text"
                            id="TenDangNhap"
                            name="TenDangNhap"
                            value={formData.TenDangNhap}
                            readOnly
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="IDVaiTro">Vai Trò :</label>
                        <select
                            id="IDVaiTro"
                            name="IDVaiTro"
                            value={formData.IDVaiTro}
                            onChange={handleChange}
                        >
                            <option value="1">Admin</option>
                            <option value="2">Employee</option>
                            <option value="3">User</option>
                        </select>
                    </div>
                    <button type="submit">Lưu</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateRoleModal;
