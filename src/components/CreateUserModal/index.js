import React, { useState } from "react";
import axios from "axios";
import style from './style.module.css';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnnouncement } from "../../contexts/Announcement";

function CreateUserModal({setShowModal}) {
    const [formData, setFormData] = useState();
    const {setSuccess  , setMessage } = useAnnouncement();

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
        validateField(id, value);
    };

    const validateField = (id, value) => {
        let errorMsg = '';
    
        switch (id) {
            case 'username':
                if (!/^[a-zA-Z0-9]{10,30}$/.test(value)) {
                    errorMsg = "Tên đăng nhập phải từ 10 đến 30 ký tự và chỉ chứa chữ cái và số.";
                }
                break;
            case 'password':
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,18}$/.test(value)) {
                    errorMsg = "Mật khẩu phải từ 6 đến 18 ký tự, gồm chữ thường, chữ in, số và ký tự đặc biệt.";
                }
                break;
            case 're_password':
                if (value !== formData.password) {
                    errorMsg = "Mật khẩu không khớp!";
                }
                break;
            case 'email':
                if (!/^[\w.%+-]+@gmail\.com$/.test(value)) {
                    errorMsg = "Email phải có đuôi @gmail.com.";
                }
                break;
            case 'phone':
                if (!/^0\d{9}$/.test(value)) {
                    errorMsg = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.";
                }
                break;
            case 'address':
                if (value.trim() === '') {
                    errorMsg = "Vui lòng nhập địa chỉ của bạn.";
                }
                break;
            case 'fullname':
                if (value.trim() === '') {
                    errorMsg = "Vui lòng nhập họ và tên của bạn.";
                }
                break;
            default:
                break;
        }
    
        setErrors(prevState => ({
            ...prevState,
            [id]: errorMsg
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validate all fields
        ['username', 'password', 're_password', 'email', 'phone'].forEach(field => {
            const value = formData[field];
            validateField(field, value);
            if (errors[field]) {
                newErrors[field] = errors[field];
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const { re_password, ...formDataToSend } = formData;
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/Backend/signup', formDataToSend);
            if (response.status === 200) { 
                setSuccess(true);
                setMessage("Đăng ký thành công");
                setShowModal(false);
            } else {
                setErrors(true);
                console.error("Đăng ký không thành công. Mã lỗi:", response.status);
                setMessage("Đăng ký không thành công. Vui lòng thử lại sau.");
            }

        } catch (error) {
            console.error("Đã xảy ra lỗi khi đăng ký!", error);
            // handle error
        }
    };

    return (
        <div className={style['Wrap']}>
            <form className={`${style['login']} ${style['scrollable']}`} onSubmit={handleSubmit}>
                <h2 className={style['wrap-back']}><FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} /></h2>
                <h1>Đăng ký</h1>

                {/* Họ tên */}
                <div className={style["input-group"]}>
                    <label htmlFor="fullname">Họ và tên</label> <br/>
                    <input type="text" id="fullname" value={formData.fullname} onChange={handleChange} required /> <br/>
                    {errors.fullname && <span className={style['error']}>{errors.fullname}</span>}
                </div>

                {/* Tên đăng nhập */}
                <div className={style["input-group"]}>
                    <label htmlFor="username">Tên đăng nhập</label> <br/>
                    <input type="text" id="username" value={formData.username} onChange={handleChange} required /> <br/>
                    {errors.username && <span className={style['error']}>{errors.username}</span>}
                </div>
                {/* Mật khẩu */}
                <div className={style["input-group"]}>
                    <label htmlFor="password">Mật khẩu</label> <br/>
                    <input type="password" id="password" value={formData.password} onChange={handleChange} required /> <br/>
                    {errors.password && <span className={style['error']}>{errors.password}</span>}
                </div>
                {/* Nhập lại mật khẩu */}
                <div className={style["input-group"]}>
                    <label htmlFor="re_password">Nhập lại mật khẩu</label> <br/>
                    <input type="password" id="re_password" value={formData.re_password} onChange={handleChange} required /> <br/>
                    {errors.re_password && <span className={style['error']}>{errors.re_password}</span>}
                </div>
                {/* Email */}
                <div className={style["input-group"]}>
                    <label htmlFor="email">Email</label> <br/>
                    <input type="email" id="email" value={formData.email} onChange={handleChange} required /> <br/>
                    {errors.email && <span className={style['error']}>{errors.email}</span>}
                </div>
                {/* Số điện thoại */}
                <div className={style["input-group"]}>
                    <label htmlFor="phone">Số điện thoại</label> <br/>
                    <input type="text" id="phone" value={formData.phone} onChange={handleChange} required /> <br/>
                    {errors.phone && <span className={style['error']}>{errors.phone}</span>}
                </div>
                {/* Địa chỉ */}
                <div className={style["input-group"]}>
                    <label htmlFor="address">Địa chỉ</label> <br/>
                    <input type="text" id="address" value={formData.address} onChange={handleChange} required /> <br/>
                    {errors.address && <span className={style['error']}>{errors.address}</span>}
                </div>
                <button type="submit" className={style['button']}>Đăng ký</button>
            </form>
        </div>
    );
}

export default CreateUserModal;
