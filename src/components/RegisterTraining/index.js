import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import style from "./style.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PaymentModal from '../PaymentModal';
import { useAnnouncement } from '../../contexts/Announcement';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

function RegisterTraining({ setShowModal, peronalTrainer }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [amount, setAmount] = useState(0);
    const [statusPayment, setStatusPayment] = useState(false);
    const { setError, setMessage, setSuccess, setLocation, setLink, setWarning } = useAnnouncement();

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setEndDate(null);
    };

    const handleEndDateChange = (date) => {
        if (!startDate) {
            setWarning(true);
            setMessage("Vui lòng chọn ngày bắt đầu trước");
            return;
        }
        if (date < startDate) {
            const newEndDate = new Date(startDate);
            newEndDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
            setEndDate(newEndDate);
        } else {
            setEndDate(date);
        }
    };
    
    const today = new Date();
    today.setHours(0, 0, 0);
    const minStartTime = new Date();
    minStartTime.setHours(8, 0, 0); 
    const maxStartTime = new Date();
    maxStartTime.setHours(17, 0, 0);
    const minEndTime = startDate ? new Date(startDate.getTime() + 60 * 60 * 1000) : null;
    const maxEndTime = new Date();
    maxEndTime.setHours(18, 0, 0);

    const calculateTotal = useCallback(() => {
        if (startDate && endDate) {
            const diff = (endDate.getHours() - startDate.getHours());
            return Math.round(diff) * peronalTrainer.GiaThue;
        }
        return 0;
    }, [startDate, endDate, peronalTrainer.GiaThue]);

    useEffect(() => {
        setAmount(calculateTotal());
    }, [startDate, endDate, calculateTotal]);

    function formatDate(date) {
        return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: vi });
    }

    const handleSubmit = (payment) => {
        if (!startDate || !endDate) {
            setError(true);
            setMessage("Bạn chưa chọn ngày giờ");
            return;
        }
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
        if (isLogin) {
            const jwt = findCookie('jwt');
            const data = {
                IDHLV: peronalTrainer.IDHLV,
                HinhThucThanhToan: payment,
                amount: amount,
                StartDate: formatDate(startDate),
                EndDate: formatDate(endDate),
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.post('http://localhost:88/Backend/PT/Register', data, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        if (response.data.success) {
                            window.location.href = response.data.success;
                        } else {
                            setSuccess(true);
                            setMessage(response.data.message);
                            setLocation(true);
                            setLink("http://localhost:3000/PT");
                        }
                    } else {
                        throw new Error("Đặt hàng không thành công!");
                    }
                }).catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                });
        } else {
            setError(true);
            setMessage("Vui lòng đăng nhập");
            setLocation(true);
            setLink("http://localhost:3000/login");
        }
    }

    const defaultMinEndTime = new Date();
    defaultMinEndTime.setHours(8, 0, 0);

    const defaultMaxEndTime = new Date();
    defaultMaxEndTime.setHours(18, 0, 0);

    return (
        <div className={style.modal}>
            <div className={style.wrap_content}>
                <h1><FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} /></h1>
                <h2>Chọn ngày và giờ đăng ký luyện tập</h2>
                <div className={style.startday}>
                    <p>Giờ bắt đầu:</p>
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        showTimeSelect
                        timeIntervals={60}
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="Chọn giờ bắt đầu"
                        minDate={today}
                        minTime={minStartTime}
                        maxTime={maxStartTime}
                        locale={vi}
                    />
                </div>
                <div className={style.endday}>
                    <p>Giờ kết thúc:</p>
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        showTimeSelect
                        timeIntervals={60}
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="Chọn giờ kết thúc"
                        minDate={startDate}
                        maxDate={startDate}
                        minTime={minEndTime ?? defaultMinEndTime}
                        maxTime={maxEndTime ?? defaultMaxEndTime}
                        locale={vi}
                    />
                </div>
                <span className={style.cost}>Thành tiền: <p>{amount && amount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p></span>
                <button onClick={() => setStatusPayment(true)}>Đăng ký ngay</button>
            </div>
            {statusPayment &&
                <PaymentModal
                    setStatusPayment={setStatusPayment}
                    handleSubmit={handleSubmit}
                />}
        </div>
    );
}

export default RegisterTraining;
