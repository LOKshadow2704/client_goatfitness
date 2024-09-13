import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PaymentModal from "../PaymentModal/PaymentModal";
import { useAnnouncement } from "../../contexts/Announcement";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import style from "./style.module.css";

function RegisterTraining({ setShowModal, peronalTrainer }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [statusPayment, setStatusPayment] = useState(false);
  const { setError, setMessage, setSuccess, setLocation, setLink, setWarning } =
    useAnnouncement();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null); // Reset endDate when startDate changes
  };

  const handleEndDateChange = (date) => {
    if (!startDate) {
      setWarning(true);
      setMessage("Vui lòng chọn ngày giờ bắt đầu trước");
      return;
    }
    if (date < startDate) {
      setWarning(true);
      setMessage("Ngày giờ kết thúc không thể trước ngày giờ bắt đầu");
      setEndDate(null); // Reset endDate if invalid
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
  const minEndTime = startDate
    ? new Date(startDate.getTime() + 60 * 60 * 1000)
    : null;
  const maxEndTime = new Date();
  maxEndTime.setHours(18, 0, 0);

  const calculateTotal = useCallback(() => {
    if (startDate && endDate && endDate > startDate) {
      const diff = (endDate - startDate) / (1000 * 60 * 60); // Difference in hours
      return Math.max(0, Math.round(diff)) * peronalTrainer.GiaThue; // Ensure non-negative amount
    }
    return 0;
  }, [startDate, endDate, peronalTrainer.GiaThue]);

  useEffect(() => {
    setAmount(calculateTotal());
  }, [startDate, endDate, calculateTotal]);

  function formatDate(date) {
    return format(date, "yyyy-MM-dd HH:mm:ss", { locale: vi });
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
        <h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setShowModal(false)}
            style={{ cursor: "pointer", fontSize: "24px", color: "#000" }}
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
              minDate={today}
              minTime={minStartTime}
              maxTime={maxStartTime}
            />
          </div>
          <div className={style.endday}>
            <p>Ngày giờ kết thúc:</p>
            <DateTimePicker
              label="Chọn ngày giờ kết thúc"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} />}
              minDate={startDate || today}
              minTime={minEndTime ?? defaultMinEndTime}
              maxTime={maxEndTime ?? defaultMaxEndTime}
            />
          </div>
        </LocalizationProvider>
        <span className={style.cost}>
          Thành tiền:{" "}
          <p>
            {amount &&
              amount.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
          </p>
        </span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setStatusPayment(true)}
        >
          Đăng ký ngay
        </Button>
      </div>
      {statusPayment && (
        <PaymentModal
          setStatusPayment={setStatusPayment}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default RegisterTraining;
