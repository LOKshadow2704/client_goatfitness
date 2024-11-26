import React, { useState } from "react";
import { IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, FormControl, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateEmployeeModal({ data, setShowModal }) {
    const { setError, setMessage, setSuccess } = useAnnouncement();
    const [formData, setFormData] = useState({
        TenDangNhap: data.TenDangNhap, 
        HoTen: data.HoTen,
        Email: data.Email,
        SDT: data.SDT,
        DichVu: data.DichVu,
        TrangThai: data.TrangThai,
    });

    // Hàm thay đổi trạng thái form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Hàm tìm cookie (JWT, PHPSESSID)
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

    // Hàm submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData); // Log dữ liệu để kiểm tra
    
        const isLogin = findCookie("jwt");
        if (isLogin) {
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
    
            try {
                // Gửi yêu cầu PUT để cập nhật thông tin nhân viên
                const response = await axios.put('http://localhost:8080/Backend/employee/update', formData, { headers: headers });
                if (response.status >= 200 && response.status < 300) {
                    setSuccess(true);
                    setMessage("Cập nhật thông tin nhân viên thành công");
                    setShowModal(false);
                } else {
                    throw new Error("Cập nhật thất bại");
                }
            } catch (error) {
                setError(true);
                setMessage(error.response?.data?.error || "Có lỗi xảy ra");
            }
        } else {
            setError(true);
            setMessage("Bạn chưa đăng nhập");
        }
    };
    
    return (
        <Dialog open onClose={() => setShowModal(false)}
            sx={{ '& .MuiDialog-paper': { width: '400px', maxWidth: '90%' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                Cập nhật thông tin nhân viên
                <IconButton
                    aria-label="close"
                    onClick={() => setShowModal(false)}
                    sx={{
                        position: 'absolute',
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
                <input type="hidden" name="TenDangNhap" value={formData.TenDangNhap} />
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Họ tên"
                            id="HoTen"
                            name="HoTen"
                            value={formData.HoTen}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Email"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Số điện thoại"
                            id="SDT"
                            name="SDT"
                            value={formData.SDT}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Dịch vụ"
                            id="DichVu"
                            name="DichVu"
                            value={formData.DichVu}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Trạng thái"
                            id="TrangThai"
                            name="TrangThai"
                            value={formData.TrangThai}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                    </FormControl>
                    <Box mt={2} textAlign="center">
                        <Button variant="contained" color="primary" type="submit" sx={{ width: '150px' }}>
                            Lưu
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateEmployeeModal;
