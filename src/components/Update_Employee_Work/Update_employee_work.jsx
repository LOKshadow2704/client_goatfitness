import React, { useState } from "react";
import { IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, FormControl, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateWorkEmployeeSchedule({ data, setShowModal }) {
    const { setError, setMessage, setSuccess } = useAnnouncement();
    const [formData, setFormData] = useState({
        TenKhachHang: data.TenKhachHang || "",
        NgayDangKy: data.NgayDangKy || "",
        NgayHetHan: data.NgayHetHan || ""
    });

    const checkFormData = (formData) => {
        for (const key in formData) {
            if (formData[key] !== "" && formData[key] !== data[key]) {
                return true;
            }
        }
        return false;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const findCookie = (name) => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isLogin = findCookie("jwt");
        if (isLogin) {
            if (checkFormData(formData)) {
                const jwt = findCookie("jwt");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt,
                    "PHPSESSID": findCookie("PHPSESSID")
                };
                axios.put("http://localhost:8080/Backend/personalTrainer/update", formData, { headers: headers })
                    .then(response => {
                        if (response.status >= 200 && response.status < 300) {
                            setSuccess(true);
                            setMessage("Cập nhật thành công");
                            setShowModal(false);
                        } else {
                            throw new Error("Cập nhật thất bại");
                        }
                    }).catch(error => {
                        setError(true);
                        setMessage(error.response ? error.response.data.error : "Đã xảy ra lỗi");
                    });
            } else {
                setError(true);
                setMessage("Không có thay đổi!");
                return;
            }
        }
    };

    return (
        <Dialog open onClose={() => setShowModal(false)}
                sx={{ "& .MuiDialog-paper": { width: "400px", maxWidth: "90%" } }}>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                Cập nhật lịch dạy HLV
                <IconButton
                    aria-label="close"
                    onClick={() => setShowModal(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Tên khách hàng"
                            id="TenKhachHang"
                            name="TenKhachHang"
                            value={formData.TenKhachHang}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Ngày đăng ký"
                            type="date"
                            id="NgayDangKy"
                            name="NgayDangKy"
                            value={formData.NgayDangKy}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Ngày hết hạn"
                            type="date"
                            id="NgayHetHan"
                            name="NgayHetHan"
                            value={formData.NgayHetHan}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <Box mt={2} textAlign="center">
                        <Button variant="contained" color="primary" type="submit" sx={{ width: "150px" }}>
                            Lưu
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateWorkEmployeeSchedule;
