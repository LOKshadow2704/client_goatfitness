import React, { useState } from "react";
import { IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, FormControl, Box, MenuItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateInvoiceModal({ data, setShowModal }) {
    const { setError, setMessage, setSuccess } = useAnnouncement();
    const [formData, setFormData] = useState({
        IDHoaDon: data.IDHoaDon, // ID hóa đơn để cập nhật
        TrangThaiThanhToan: data.TrangThaiThanhToan // Chỉ chỉnh sửa trạng thái thanh toán
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
                // Gửi yêu cầu PUT
                const response = await axios.put('http://localhost:8080/Backend/invoicePackgym/update', formData, { headers: headers });
                if (response.status >= 200 && response.status < 300) {
                    setSuccess(true);
                    setMessage("Cập nhật trạng thái thanh toán thành công");
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
                Cập nhật trạng thái thanh toán
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
                {/* Hiển thị thông tin không chỉnh sửa */}
                <Box>
                    <TextField
                        label="Họ tên khách hàng"
                        value={data.HoTen}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        margin="normal"
                        sx={{marginTop:'25px'}}
                    />
                    <TextField
                        label="Tên gói tập"
                        value={data.TenGoiTap}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Ngày đăng ký"
                        value={data.NgayDangKy}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Ngày hết hạn"
                        value={data.NgayHetHan}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                </Box>
                {/* Chỉ cho chỉnh sửa trạng thái thanh toán */}
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            select
                            label="Trạng thái thanh toán"
                            id="TrangThaiThanhToan"
                            name="TrangThaiThanhToan"
                            value={formData.TrangThaiThanhToan}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="Đã Thanh Toán">Đã Thanh Toán</MenuItem>
                            <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
                        </TextField>
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

export default UpdateInvoiceModal;
