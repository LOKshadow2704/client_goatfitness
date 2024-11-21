import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useAnnouncement } from "../../contexts/Announcement";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

function UserPackage({ setShowModal }) {
  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
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
        .get("http://localhost:8080/Backend/gympack/user", { headers: headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setData(response.data);

            if (response.data?.TrangThaiThanhToan === "Chưa thanh toán") {
              setShowAlert(true);
              setWarning(true);
              setMessage("Vui lòng thanh toán cho nhân viên để tiếp tục sử dụng dịch vụ.");
              setLocation(true);
              setLink("http://localhost:3000/GymPack");
            }
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response?.data?.error || "Đã xảy ra lỗi khi tải dữ liệu.");
          setLocation(true);
          setLink("http://localhost:3000/GymPack");
        });
    }
  }, [setError, setMessage, setWarning, setLocation, setLink]);

  const getTableContent = () => {
    if (!data?.info?.TenGoiTap) return [];
    const lowerCaseName = data.info.TenGoiTap.toLowerCase();
    if (lowerCaseName.startsWith("classic")) {
      return [
        "Tự do tập luyện tại tất cả câu lạc bộ trong hệ thống GOAT Fitness.",
        "Nước uống miễn phí.",
        "Dịch vụ khăn tập thể thao cao cấp.",
        "1 buổi định hướng luyện tập riêng biệt và tư vấn dinh dưỡng.",
        "Được sử dụng dịch vụ thư giãn sau luyện tập (sauna và steambath).",
      ];
    } else if (lowerCaseName.startsWith("royal")) {
      return [
        "Không giới hạn thời gian luyện tập.",
        "Tự do tập luyện tại tất cả câu lạc bộ trong hệ thống GOAT Fitness.",
        "Nước uống miễn phí.",
        "Dịch vụ khăn tập thể thao cao cấp.",
        "1 buổi định hướng luyện tập riêng biệt và tư vấn dinh dưỡng.",
        "Được sử dụng dịch vụ thư giãn sau luyện tập (sauna và steambath).",
        "Được dẫn theo 1 người thân đi tập cùng (người đi cùng được phục vụ như quyền lợi thẻ classic).",
      ];
    }
    return [];
  };

  const tableContent = getTableContent();

  return (
    <Modal open={true} onClose={() => setShowModal(false)}>
      <Box sx={modalStyle}>
        <IconButton
          onClick={() => setShowModal(false)}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" align="center" mb={2} sx={{fontWeight:"bold"}}> 
          Thông tin gói tập của bạn
        </Typography>
        {data?.TrangThaiThanhToan === "Đã thanh toán" ? (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{textAlign:"center",marginBottom:"15px"}}>
              Tên gói tập: {data?.info?.TenGoiTap || "Chưa có thông tin"}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2" gutterBottom>
                Ngày đăng ký: {data?.NgayDangKy ? new Date(data.NgayDangKy).toLocaleString("vi-VN") : "Không có"}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Ngày hết hạn: {data?.NgayHetHan ? new Date(data.NgayHetHan).toLocaleString("vi-VN") : "Không có"}
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{backgroundColor: "#f5f5f5"}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{fontWeight:"bold",}}>Các dịch vụ đi kèm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableContent.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          style={{ marginRight: 8, color: "green" }}
                        />
                        {item}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography variant="body2" color="error" align="center">
            Bạn cần thanh toán để hiển thị thông tin gói tập.
          </Typography>
        )}
        <Box textAlign="center" mt={3}>
          <Button variant="contained" color="primary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default UserPackage;
