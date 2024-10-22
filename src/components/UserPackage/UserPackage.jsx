import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { useAnnouncement } from "../../contexts/Announcement";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function UserPackage({ setShowModal }) {
  const [data, setData] = useState(null);
  const { setError, setMessage, setWarning, setLocation, setLink } = useAnnouncement();

  useEffect(() => {
    const findCookie = (name) => {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    };

    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };

      axios
        .get("http://localhost:8080/Backend/gympack", { headers: headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setData(response.data);
            console.log(response.data);

            // Kiểm tra trạng thái thanh toán và hiển thị thông báo nếu cần
            if (response.data.TrangThaiThanhToan === "Chưa thanh toán") {
              setWarning(true);
              setMessage("Vui lòng thanh toán để tiếp tục sử dụng dịch vụ.");
              setLocation(true);
              setLink("http://localhost:3000/GymPack");
            }
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
          setLocation(true);
          setLink("http://localhost:3000/GymPack");
        });
    }
  }, [setError, setMessage, setWarning, setLocation, setLink]);

  // Xác định giá trị hiển thị cho ngày đăng ký và ngày hết hạn
  const displayDate = data && data.TrangThaiThanhToan === "Chưa thanh toán" ? "Không có" : data ? data.NgayDangKy : "";
  const displayExpiryDate = data && data.TrangThaiThanhToan === "Chưa thanh toán" ? "Không có" : data ? data.NgayHetHan : "";

  return (
    <div className={style.modal}>
      <div className={style.wrap_content}>
        <h1>
          <FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} />
        </h1>
        <h1 style={{textAlign:'center',marginBottom:'10px'}}>Thông tin gói tập của bạn</h1>
        <div className={style.info}>
          <h3>Tên gói tập: {data && data.info.TenGoiTap}</h3>
          <span>Ngày đăng ký: {displayDate}</span>
          <span>Ngày hết hạn: {displayExpiryDate}</span>
          {/* <span>Trạng thái thanh toán: {data && data.TrangThaiThanhToan}</span> */}
        </div>
        <div className={style.describe}>
          <TableContainer component={Paper} sx={{ paddingTop: 5, paddingBottom: 5 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Classic</TableCell>
                  <TableCell align="center">Royal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Không giới hạn thời gian luyện tập</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Tự do tập luyện tại tất cả câu lạc bộ trong hệ thống GOAT Fitness
                  </TableCell>
                  <TableCell align="center">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </TableCell>
                  <TableCell align="center">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nước uống miễn phí</TableCell>
                  <TableCell align="center">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </TableCell>
                  <TableCell align="center">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default UserPackage;
