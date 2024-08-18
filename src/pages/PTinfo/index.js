import React, { useEffect, useState } from "react";
import style from './style.module.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {useParams} from 'react-router-dom';
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarRating from "../../components/Rating";
import RegisterTraining from "../../components/RegisterTraining";

function PTInfo (){
    const {PTID} =  useParams();
    const [peronalTrainer, setperonalTrainer] = useState();
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        fetch(`http://localhost:8080/Backend/personalTrainer/Info?IDHLV=${PTID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi server');
                } else {
                    return response.json();
                }
            })
            .then(data => {
                setperonalTrainer(data[0]);
            })
            .catch(error => {
                console.error('Lỗi khi truy cập dữ liệu', error);
            })
    }, [PTID]);
    return(
        <>
            <Header></Header>
            <div className={style.container}>
                <div className={style.left}>
                        <img src={peronalTrainer && peronalTrainer.avt} alt="" width='50%' />
                </div>
                <div className={style.right}>
                    <div className={style.info}>
                        <h1>Họ và tên HLV: {peronalTrainer && peronalTrainer.HoTen}</h1>
                        <p className={style.rating}>Đánh giá </p>
                        <StarRating rating={peronalTrainer && peronalTrainer.DanhGia}/>
                        <div className={style.info}>
                            <p>Loại dịch vụ: {peronalTrainer && peronalTrainer.DichVu}</p>
                        </div>
                        
                    </div>
                    <div className={style.info}>
                        <p>Các chứng chỉ: {peronalTrainer && peronalTrainer.ChungChi}</p>
                        <span className={style.info}>Liên hệ công việc: {peronalTrainer && peronalTrainer.SDT }</span>
                    </div>
                    <button className={style['CartBtn']} onClick={()=>setShowModal(true)}>
                            <p className={style['text']}>Đăng ký tập ngay <FontAwesomeIcon icon={faCaretRight} /></p>
                        </button>
                </div>
                {
                    showModal && <RegisterTraining setShowModal = {setShowModal}  peronalTrainer = {peronalTrainer}/>
                }
            </div>
            <Footer></Footer>
        </>
    );
}

export default PTInfo;