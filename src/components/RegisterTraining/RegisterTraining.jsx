import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PaymentModal from '../PaymentModal/PaymentModal';
import { useAnnouncement } from '../../contexts/Announcement';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import style from './style.module.css';

function RegisterTraining({ setShowModal, peronalTrainer }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [statusPayment, setStatusPayment] = useState(false);
  const { setError, setMessage, setSuccess, setLocation, setLink, setWarning } = useAnnouncement();

  const handleStartDateChange = (date) => {
    if (!date) return;
    const hour = date.getHours();
    if (hour < 8 || hour > 22) {
      setError(true);
      setMessage('Giờ bắt đầu phải từ 8:00.');
      setStartDate(null);
    } else {
      setStartDate(date);
      setEndDate(null); // Reset giờ kết thúc khi chọn giờ bắt đầu mới
    }
  };

  const handleEndDateChange = (date) => {
    if (!startDate) {
      setWarning(true);
      setMessage('Vui lòng chọn ngày giờ bắt đầu trước.');
      return;
    }

    if (!date) return;

    if (date <= startDate) {
      setError(true);
      setMessage('Giờ kết thúc phải cách giờ bắt đầu ít nhất 1 giờ.');
      setEndDate(null);
      return;
    }

    const startHour = startDate.getHours();
    const endHour = date.getHours();

    if (endHour > 22 || startHour < 8 || endHour < 8) {
      setError(true);
      setMessage('Giờ kết thúc phải trước 22:00.');
      setEndDate(null);
    } else {
      setEndDate(date);
    }
  };

  const calculateTotal = useCallback(() => {
    if (startDate && endDate && endDate > startDate) {
      const diff = (endDate - startDate) / (1000 * 60 * 60); // Difference in hours
      return Math.max(0, Math.round(diff)) * peronalTrainer.GiaThue;
    }
    return 0;
  }, [startDate, endDate, peronalTrainer.GiaThue]);

  useEffect(() => {
    setAmount(calculateTotal());
  }, [startDate, endDate, calculateTotal]);

  const handleSubmit = (payment) => {
    if (!startDate || !endDate) {
      setError(true);
      setMessage('Bạn chưa chọn ngày giờ.');
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

    const jwt = findCookie('jwt');
    if (!jwt) {
      setError(true);
      setMessage('Vui lòng đăng nhập.');
      setLocation(true);
      setLink('http://localhost:3000/login');
      return;
    }

    const data = {
      IDHLV: peronalTrainer.IDHLV,
      HinhThucThanhToan: payment,
      StartDate: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
      EndDate: format(endDate, 'yyyy-MM-dd HH:mm:ss'),
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .post('http://localhost:8080/Backend/personalTrainer/Register', data, { headers })
      .then((response) => {
        if (response.data.success) {
          window.location.href = response.data.success;
        } else {
          setSuccess(true);
          setMessage(response.data.message || 'Đăng ký thành công.');
        }
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          setError(true);
          setMessage(error.response.data.error);
        } else {
          setError(true);
          setMessage('Đăng ký không thành công. Hãy thử lại.');
        }
      });
  };

  return (
    <div className={style.modal}>
      <div className={style.wrap_content}>
        <h1>
          <FontAwesomeIcon
            icon={faXmark}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowModal(false)}
          />
        </h1>
        <h2>Chọn ngày và giờ đăng ký luyện tập</h2>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
          <div className={style.startday}>
            <p>Ngày giờ bắt đầu:</p>
            <DateTimePicker
              label="Chọn ngày giờ bắt đầu"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} />}
              minDateTime={new Date()} // Ngày không thể nhỏ hơn ngày hiện tại
              ampm={false} // Dùng định dạng 24 giờ
            />
          </div>

          <div className={style.endday}>
            <p>Ngày giờ kết thúc:</p>
            <DateTimePicker
              label="Chọn ngày giờ kết thúc"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} />}
              minDateTime={startDate || new Date()} // Ngày phải lớn hơn hoặc bằng ngày bắt đầu
              ampm={false} // Dùng định dạng 24 giờ
            />
          </div>
        </LocalizationProvider>

        <span className={style.cost}>
          Thành tiền:{' '}
          <p>
            {amount && amount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
          </p>
        </span>
        <Button variant="contained" color="primary" onClick={() => setStatusPayment(true)}>
          Đăng ký ngay
        </Button>
      </div>
      {statusPayment && <PaymentModal setStatusPayment={setStatusPayment} handleSubmit={handleSubmit} />}
    </div>
  );
}

export default RegisterTraining;
