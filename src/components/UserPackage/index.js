import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { useAnnouncement } from "../../contexts/Announcement";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function UserPackage({ setShowModal }) {
  const [data, setData] = useState();
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
        .get("http://localhost:8080/Backend/PackageGym/UserInfo", { headers: headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setData(response.data);
            console.log(response.data);
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
          setLocation(true);
          setLink("http://localhost:3000/GymPack");
        });
    }
  }, [setError, setMessage, setLocation, setLink]);

  return (
    <div className={style.modal}>
      <div className={style.wrap_content}>
        <h1>
          <FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} />
        </h1>
        <h1>Thông tin gói tập của bạn</h1>
        <div className={style.info}>
          <h1>Tên gói tập: {data && data.info.TenGoiTap}</h1>
          <span>Ngày đăng ký: {data && data.NgayDangKy}</span>
          <span>Ngày hết hạn: {data && data.NgayHetHan}</span>
        </div>
        <div className={style.describe}>
          <TableContainer component={Paper} sx={{ paddingTop:5, paddingBottom:5 }}> 
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
