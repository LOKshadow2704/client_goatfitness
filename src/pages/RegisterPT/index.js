import React, { useState } from 'react';
import style from "./style.module.css";
import axios from 'axios';
import { useAnnouncement } from '../../contexts/Announcement';

function RegisterPT({ setShowModal }) {
    const [certificates, setCertificates] = useState('');
    const [serviceID, setServiceID] = useState('');
    const [desiredRent, setDesiredRent] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); 

        const data = {
            certificates,
            serviceID,
            desiredRent,
        };

        axios.post('http://localhost:8080/Backend/PT/register', data)
            .then(response => {
                setIsLoading(false); 
                setSuccess(true);
                setMessage('Đăng ký thành công!');
                setLocation(true);
                setLink("http://localhost:3000/PT");
                setShowModal(false);
            })
            .catch(error => {
                setIsLoading(false);   
                setError(true);
                setMessage('Đăng ký thất bại');
            });
    };

    return (
        <div className={style['modal']}>
            <div className={style['modalContent']}>
                <span className={style['close']} onClick={() => setShowModal(false)}>&times;</span>
                <h2>Đăng ký làm huấn luyện viên cá nhân</h2>
                <form onSubmit={handleSubmit}>
                    <div className={style['formGroup']}>
                        <label htmlFor="certificates">Chứng chỉ</label>
                        <textarea
                            id="certificates"
                            value={certificates}
                            onChange={(e) => setCertificates(e.target.value)}
                            required
                        />
                    </div>
                    <div className={style['formGroup']}>
                        <label htmlFor="serviceID">Dịch vụ</label>
                        <select
                            id="serviceID"
                            value={serviceID}
                            onChange={(e) => setServiceID(e.target.value)}
                            required
                        >
                            <option value="">Vui lòng lựa chọn dịch vụ</option>
                            <option value="gym">Gym</option>
                            <option value="yoga">Yoga</option>
                        </select>
                    </div>
                    <div className={style['formGroup']}>
                        <label htmlFor="desiredRent">Giá thuê mong muốn</label>
                        <input
                            type="text"
                            id="desiredRent"
                            value={desiredRent}
                            onChange={(e) => setDesiredRent(e.target.value)}
                            required
                        />
                    </div>
                    <div className={style['formGroup']} >
                        {/* Hiển thị nút gửi hoặc loading */}
                        {isLoading ? (
                            <button type="button" disabled>Đang gửi...</button>
                        ) : (
                            <button type="submit">Gửi</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPT;
