import React, { useEffect, useState } from "react";
import style from "./style.module.css"; 
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useAnnouncement } from "../../contexts/Announcement";

function UserPTPackage({ setShowModal }) {
  const [data, setData] = useState(null);
  const { setError, setMessage, setLocation, setLink } = useAnnouncement();

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
        .get("http://localhost:8080/Backend/personalTrainer/all", { headers: headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setData(response.data[0]); // Lấy dữ liệu đầu tiên trong mảng
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
          setLocation(true);
          setLink("http://localhost:3000/PT");
        });
    }
  }, [setError, setMessage, setLocation, setLink]);

  return (
    <div className={style.modal}>
      <div className={style.wrap_content}>
        <h1>
          <FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} />
        </h1>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Thông tin thuê PT</h1>
        <div className={style.describe}>
          <TableContainer component={Paper} sx={{ paddingTop: 5, paddingBottom: 5 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Thông tin</TableCell>
                  <TableCell align="center">Chi tiết</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>ID hóa đơn</TableCell>
                  <TableCell align="center">{data ? data.IDHoaDon : "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tên HLV</TableCell>
                  <TableCell align="center">{data ? data.TenHLV : "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell align="center">{data ? data.SDT : "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dịch vụ</TableCell>
                  <TableCell align="center">{data ? data.DichVu : "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Giá thuê</TableCell>
                  <TableCell align="center">{data ? data.GiaThue.toLocaleString() + " VND" : "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ngày đăng ký</TableCell>
                  <TableCell align="center">{data ? data.NgayDangKy : "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ngày hết hạn</TableCell>
                  <TableCell align="center">{data ? data.NgayHetHan : "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Trạng thái thanh toán</TableCell>
                  <TableCell 
                    align="center" 
                    style={{
                      color: data?.TrangThaiThanhToan === "Đã thanh toán" ? "green" : "red",
                    }}
                  >
                    {data ? data.TrangThaiThanhToan : "Không có"}
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

export default UserPTPackage;
