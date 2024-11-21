import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import RegisterTraining from "../../components/RegisterTraining/RegisterTraining";
import RatePT from "../../components/Rate_PT/Rate_PT"; 

function PTInfo() {
  const { PTID } = useParams();
  const [peronalTrainer, setperonalTrainer] = useState();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/Backend/personalTrainer/Info?IDHLV=${PTID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi server");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setperonalTrainer(data);
      })
      .catch((error) => {
        console.error("Lỗi khi truy cập dữ liệu", error);
      });
  }, [PTID]);

  // Xử lý logic gửi đánh giá
  const handleReviewSubmit = (reviewData) => {
    console.log("Dữ liệu đánh giá:", reviewData);
    // Gửi dữ liệu đánh giá lên backend
    fetch("http://localhost:8080/Backend/personalTrainer/SubmitReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        PTID,
        rating: reviewData.rating,
        reviewText: reviewData.reviewText,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi gửi đánh giá");
        }
        return response.json();
      })
      .then((data) => {
        alert("Gửi đánh giá thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi đánh giá", error);
      });
  };

  return (
    <>
      <Header />
      <div className={style.container}>
        <div className={style.left}>
          <img
            src={peronalTrainer && peronalTrainer.avt}
            alt=""
            width="50%"
          />
        </div>
        <div className={style.right}>
          <div className={style.info}>
            <h1 style={{ fontSize: "26px" }}>
              Họ và tên HLV: {peronalTrainer && peronalTrainer.HoTen}
            </h1>
            <div className={style.info} style={{ marginTop: "30px" }}>
              <p>Loại dịch vụ: {peronalTrainer && peronalTrainer.DichVu}</p>
            </div>
            <div className={style.info}>
              <p>
                Giá thuê:{" "}
                <p style={{ color: "red" }}>
                  {peronalTrainer &&
                    peronalTrainer.GiaThue.toLocaleString("vi-VN")}
                </p>{" "}
                VNĐ / giờ
              </p>
            </div>
          </div>
          <div className={style.info}>
            <p>
              Các chứng chỉ: {peronalTrainer && peronalTrainer.ChungChi}
            </p>
            <span className={style.info}>
              Liên hệ công việc: {peronalTrainer && peronalTrainer.SDT}
            </span>
          </div>
          <button
            className={style["CartBtn"]}
            onClick={() => setShowModal(true)}
          >
            <p className={style["text"]}>Đăng ký tập ngay</p>
          </button>
        </div>
        {showModal && (
          <RegisterTraining
            setShowModal={setShowModal}
            peronalTrainer={peronalTrainer}
          />
        )}
      </div>
      <hr />
      <Box sx={{ marginTop: 2, padding: 2 }}>
        <Typography variant="h5" gutterBottom sx={{fontWeight:'bold'}}>
          Đánh giá HLV
        </Typography>
        <RatePT onSubmit={handleReviewSubmit} />
      </Box>

      <Footer />
    </>
  );
}

export default PTInfo;
