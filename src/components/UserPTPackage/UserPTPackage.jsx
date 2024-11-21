import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UserPTPackage({ setShowModal }) {
  const [data, setData] = useState(null); 
  const [history, setHistory] = useState([]); 
  const [selectedInvoice, setSelectedInvoice] = useState(null); 
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
        .get("http://localhost:8080/Backend/personalTrainer/practiceSchedule", { headers: headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setHistory(response.data); // Lưu toàn bộ danh sách lịch sử thuê PT
            setData(response.data[0]); // Mặc định hiển thị hóa đơn đầu tiên
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

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice); // Chọn hóa đơn để hiển thị chi tiết
  };

  const handleBackToList = () => {
    setSelectedInvoice(null); // Quay lại danh sách lịch sử
  };

  // Hàm để kiểm tra trạng thái hết hạn của hóa đơn
  const getInvoiceStatus = (expirationDate) => {
    const currentDate = new Date();
    const expiration = new Date(expirationDate);
    
    // So sánh ngày hiện tại với ngày hết hạn
    if (currentDate < expiration) {
      return { status: "Chưa hết hạn", color: "green" }; 
    } else {
      return { status: "Đã hết hạn", color: "red" }; 
    }
  };

  return (
    <Dialog open={true} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} style={{ cursor: "pointer" }} />
        <span style={{ textAlign: "center", width: "100%", display: "inline-block", marginLeft: "30px", fontWeight:"bold" }}>
          {selectedInvoice ? "Chi tiết thuê PT" : "Danh sách lịch sử thuê PT"}
        </span>
      </DialogTitle>
      <DialogContent>
        {selectedInvoice ? (
          // <TableContainer component={Paper} sx={{ paddingBottom: 5, backgroundColor: "#f5f5f5" }}>
          //   <Table>
          //     <TableHead>
          //       <TableRow>
          //         <TableCell align="center" sx={{fontWeight:"bold"}}>Thông tin</TableCell>
          //         <TableCell align="center" sx={{fontWeight:"bold"}}>Chi tiết</TableCell>
          //       </TableRow>
          //     </TableHead>
          //     <TableBody>
          //       <TableRow>
          //         <TableCell align="center">ID hóa đơn</TableCell>
          //         <TableCell align="center">{selectedInvoice.IDHoaDon}</TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Tên HLV</TableCell>
          //         <TableCell align="center">{selectedInvoice.TenHLV}</TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Số điện thoại</TableCell>
          //         <TableCell align="center">{selectedInvoice.SDT}</TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Dịch vụ</TableCell>
          //         <TableCell align="center">{selectedInvoice.DichVu}</TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Giá thuê</TableCell>
          //         <TableCell align="center">
          //           {selectedInvoice.GiaThue.toLocaleString() + " VND"}
          //         </TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Ngày đăng ký</TableCell>
          //         <TableCell align="center">{new Date(selectedInvoice.NgayDangKy).toLocaleString("vi-VN")}</TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Ngày hết hạn</TableCell>
          //         <TableCell align="center">{new Date(selectedInvoice.NgayHetHan).toLocaleString("vi-VN")}</TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Trạng thái thanh toán</TableCell>
          //         <TableCell
          //           align="center"
          //           style={{
          //             color: selectedInvoice.TrangThaiThanhToan === "Đã thanh toán" ? "green" : "red",
          //           }}
          //         >
          //           {selectedInvoice.TrangThaiThanhToan}
          //         </TableCell>
          //       </TableRow>
          //       <TableRow>
          //         <TableCell align="center">Trạng thái hóa đơn</TableCell>
          //         <TableCell
          //           align="center"
          //           style={{
          //             color: getInvoiceStatus(selectedInvoice.NgayHetHan).color,
          //           }}
          //         >
          //           {getInvoiceStatus(selectedInvoice.NgayHetHan).status}
          //         </TableCell>
          //       </TableRow>
          //     </TableBody>
          //   </Table>
          //   <DialogActions sx={{marginTop:"20px",display:"flex", justifyContent:"center",alignItems:"center"}}>
          //     <Button variant="contained" color="secondary" onClick={handleBackToList}>
          //       Quay lại danh sách
          //     </Button>
          //   </DialogActions>
          // </TableContainer>
          <TableContainer component={Paper} sx={{ paddingBottom: 2, backgroundColor: "#f5f5f5" }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>Thông tin</TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold", borderLeft: "1px solid #ccc" }}>Chi tiết</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell align="center">ID hóa đơn</TableCell>
        <TableCell align="center" sx={{ borderLeft: "1px solid #ccc" }}>{selectedInvoice.IDHoaDon}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Tên HLV</TableCell>
        <TableCell align="center" sx={{ borderLeft: "1px solid #ccc" }}>{selectedInvoice.TenHLV}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Số điện thoại</TableCell>
        <TableCell align="center" sx={{ borderLeft: "1px solid #ccc" }}>{selectedInvoice.SDT}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Dịch vụ</TableCell>
        <TableCell align="center" sx={{ borderLeft: "1px solid #ccc" }}>{selectedInvoice.DichVu}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Giá thuê</TableCell>
        <TableCell align="center" sx={{ borderLeft: "1px solid #ccc" }}>
          {selectedInvoice.GiaThue.toLocaleString() + " VND"}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Ngày đăng ký</TableCell>
        <TableCell align="center" sx={{ borderLeft: "1px solid #ccc" }}>
          {new Date(selectedInvoice.NgayDangKy).toLocaleString("vi-VN")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Ngày hết hạn</TableCell>
        <TableCell align="center" sx={{ borderLeft: "1px solid #ccc" }}>
          {new Date(selectedInvoice.NgayHetHan).toLocaleString("vi-VN")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Trạng thái thanh toán</TableCell>
        <TableCell
          align="center"
          sx={{ borderLeft: "1px solid #ccc", color: selectedInvoice.TrangThaiThanhToan === "Đã thanh toán" ? "green" : "red" }}
        >
          {selectedInvoice.TrangThaiThanhToan}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">Trạng thái hóa đơn</TableCell>
        <TableCell
          align="center"
          sx={{ borderLeft: "1px solid #ccc", color: getInvoiceStatus(selectedInvoice.NgayHetHan).color }}
        >
          {getInvoiceStatus(selectedInvoice.NgayHetHan).status}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <DialogActions sx={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Button variant="contained" color="secondary" onClick={handleBackToList}>
      Quay lại danh sách
    </Button>
  </DialogActions>
</TableContainer>

        ) : (
          <TableContainer component={Paper} sx={{ paddingBottom: 5 , backgroundColor: "#f5f5f5"}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{fontWeight:"bold"}}>STT</TableCell>
                  <TableCell align="center" sx={{fontWeight:"bold"}}>Lịch sử thuê</TableCell>
                  <TableCell align="center" sx={{fontWeight:"bold"}}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={item.IDHoaDon}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                    {new Date(item.NgayDangKy).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(item)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserPTPackage;
