import React from "react";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function PaymentModal({ setStatusPayment , handleSubmit , selectedPackage}  ) {
    
    return (
        <div className={style.modal}>
            <h1><FontAwesomeIcon icon={faXmark} onClick={() => setStatusPayment(false)}/></h1>
            <h2>Chọn hình thức thanh toán </h2>
            <button onClick={() => {  handleSubmit(1 , selectedPackage); }}>Thanh toán trực tiếp</button>
            <button onClick={() => {  handleSubmit(2 , selectedPackage); }}>Thanh toán trực tuyến</button>
        </div>
    );
};

export default PaymentModal;
