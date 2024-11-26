import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function PTManageSchedule({ setShowModal }) {
  const mockData = [
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      sdt: "0888552324",
      service: "Hướng dẫn gym cá nhân",
      startTime: "2024-11-26T08:00:00",
      endTime: "2024-11-26T09:30:00",
      paymentstatus: "Chưa thanh toán",
      status: "Chưa xác nhận",
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      service: "Yoga nhóm nhỏ",
      startTime: "2024-11-26T10:00:00",
      endTime: "2024-11-26T11:00:00",
      status: "Đã xác nhận",
    },
    {
      id: 3,
      customerName: "Lê Văn C",
      service: "Giảm cân chuyên sâu",
      startTime: "2024-11-27T14:00:00",
      endTime: "2024-11-27T15:30:00",
      status: "Đã hoàn thành",
    },
  ];

  const [schedules, setSchedules] = useState(mockData);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [buttonsHidden, setButtonsHidden] = useState(false); // Trạng thái ẩn nút

  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    setButtonsHidden(false); // Reset trạng thái ẩn nút khi chọn lịch khác
  };

  const handleBackToList = () => {
    setSelectedSchedule(null);
  };

  const handleUpdateStatus = (id, status) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setButtonsHidden(true); // Ẩn nút sau khi cập nhật trạng thái
  };

  return (
    <Dialog open={true} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => setShowModal(false)}
          style={{ cursor: "pointer" }}
        />
        <span
          style={{
            textAlign: "center",
            width: "100%",
            display: "inline-block",
            marginLeft: "30px",
            fontWeight: "bold",
          }}
        >
          {selectedSchedule ? "Chi tiết lịch dạy" : "Danh sách lịch dạy"}
        </span>
      </DialogTitle>
      <DialogContent>
        {selectedSchedule ? (
          <TableContainer component={Paper} sx={{ paddingBottom: 2, backgroundColor: "#f5f5f5" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="center">Khách hàng</TableCell>
                  <TableCell align="center">{selectedSchedule.customerName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Số điện thoại</TableCell>
                  <TableCell align="center">{selectedSchedule.sdt}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Dịch vụ</TableCell>
                  <TableCell align="center">{selectedSchedule.service}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Thời gian</TableCell>
                  <TableCell align="center">
                    {new Date(selectedSchedule.startTime).toLocaleString("vi-VN")} -{" "}
                    {new Date(selectedSchedule.endTime).toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Trạng thái thanh toán</TableCell>
                  <TableCell align="center">{selectedSchedule.paymentstatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">{selectedSchedule.status}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <DialogActions
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {!buttonsHidden && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateStatus(selectedSchedule.id, "Đã hoàn thành")}
                  >
                    Xác nhận hoàn thành
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleUpdateStatus(selectedSchedule.id, "Đã hủy")}
                  >
                    Hủy lịch
                  </Button>
                </>
              )}
              <Button variant="contained" color="secondary" onClick={handleBackToList}>
                Quay lại
              </Button>
            </DialogActions>
          </TableContainer>
        ) : (
          <TableContainer component={Paper} sx={{ paddingBottom: 5, backgroundColor: "#f5f5f5" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    STT
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Khách hàng
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Thời gian
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Trạng thái
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: "gray" }}>
                      Không có lịch dạy nào
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{item.customerName}</TableCell>
                      <TableCell align="center">
                        {new Date(item.startTime).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell align="center">{item.status}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PTManageSchedule;
