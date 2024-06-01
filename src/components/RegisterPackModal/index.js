import React, { useState } from "react";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function RegisterPackModal({ data, setShowModal }) {
    const [formData, setFormData] = useState({
        SDT: "",
        IDGoiTap: "",
        ThoiHan: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        // Kiểm tra xem số điện thoại có bắt đầu bằng số 0 hay không
        if (name === "SDT" && value.length > 0 && value.charAt(0) !== '0') {
            alert("Số điện thoại phải bắt đầu bằng số 0");
            return;
        }

        if (name === "IDGoiTap") {
            const selectedPack = data.find(pack => pack.IDGoiTap === parseInt(value));
            if (selectedPack) {
                updatedFormData.ThoiHan = selectedPack.ThoiHan;
            } else {
                updatedFormData.ThoiHan = "";
            }
        }

        setFormData(updatedFormData);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
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
            if (!formData.SDT || !formData.IDGoiTap) {
                alert("Vui lòng điền đầy đủ thông tin");
                return;
            }
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            console.log(formData);
            axios.post('http://localhost:88/Backend/gympack/registerByEmployee', formData ,{ headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        alert("Đăng ký thành công!");
                        setShowModal(false);
                    } else {
                        throw new Error("Đăng ký thất bại");
                    }
                })
                .catch(error => {
                    console.log(error.response.data)
                    alert(error.response.data.error);
                });
        }    
    };

    return (
        <div className={style.modal}>
            <div className={style.wrap_content}>
                <p><FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} /></p>
                <h1>Đăng ký mới</h1>
                <form className={style.updateForm} onSubmit={handleSubmit}>
                    <div className={style.formGroup}>
                        <label htmlFor="SDT">Số điện thoại: </label>
                        <input
                            type="text"
                            pattern="[0-9]*"
                            maxLength="11"
                            minLength="10"
                            id="SDT"
                            name="SDT"
                            value={formData.SDT}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="IDGoiTap">Loại sản phẩm:</label>
                        <select
                            id="IDGoiTap"
                            name="IDGoiTap"
                            value={formData.IDGoiTap}
                            onChange={handleChange}
                        >
                            <option value="">Chọn loại sản phẩm</option>
                            {data && data.map((value) => (
                                <option
                                    key={value.IDGoiTap}
                                    value={value.IDGoiTap}
                                >
                                    {value.TenGoiTap}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Lưu</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPackModal;
