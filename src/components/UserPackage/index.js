import React, { useState } from "react";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const services = {
  classic: {
    duration: "15 THÁNG",
    cost: "11,880,000 VNĐ",
    costPerMonth: "792,000 VNĐ",
    costPerDay: "26,400 VNĐ",
  },
  "classic-plus": {
    duration: "22 THÁNG",
    cost: "17,930,000 VNĐ",
    costPerMonth: "815,000 VNĐ",
    costPerDay: "27,167 VNĐ",
  },
  citipassport: {
    duration: "36 THÁNG",
    cost: "29,810,000 VNĐ",
    costPerMonth: "828,056 VNĐ",
    costPerDay: "27,602 VNĐ",
  },
  // Add more services as needed
};

function UserPackage({ setShowModal }) {
  const [selectedService, setSelectedService] = useState("classic");

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const { duration, cost, costPerMonth, costPerDay } = services[selectedService];

  return (
    <div className={style.modal}>
      <div className={style.wrap_content}>
        <h1><FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} /></h1>
        <h1>Thông tin gói tập của bạn</h1>
        <div className={style.serviceTabs}>
          {Object.keys(services).map((service) => (
            <button
              key={service}
              className={selectedService === service ? style.active : ""}
              onClick={() => handleServiceClick(service)}
            >
              {service.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={style.info}>
          <h1>Thời gian tập luyện: {duration}</h1>
          <span>Tổng chi phí: {cost}</span>
          <span>Chi phí / tháng: {costPerMonth}</span>
          <span>Chi phí / ngày: {costPerDay}</span>
        </div>
        <button className={style.registerButton}>ĐĂNG KÝ NGAY</button>
      </div>
    </div>
  );
}

export default UserPackage;
