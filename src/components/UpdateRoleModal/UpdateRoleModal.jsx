import React, { useState } from "react";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import { TextField, Select, MenuItem, Button, IconButton, FormControl, InputLabel, Box, Typography, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";

// Style cho Modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};

function UpdateRoleModal({ data, setShowModal }) {
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();
    const [formData, setFormData] = useState({
        TenDangNhap: data.TenDangNhap,
        IDVaiTro: data.IDVaiTro,
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isLogin = findCookie("jwt");
        if (isLogin) {
            if (formData.TenDangNhap === data.TenDangNhap && formData.IDVaiTro === data.IDVaiTro) {
                setError(true);
                setMessage("Không có thay đổi nào cả");
                setShowModal(false);
                return;
            }
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            console.log(formData)
            axios.put('http://localhost:8080/Backend/admin/update', formData, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setSuccess(true);
                        setMessage("Cập nhật thành công");
                        setShowModal(false);
                    } else {
                        throw new Error("Lấy thông tin thất bại");
                    }
                }).catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                });
        } else {
            setError(true);
            setMessage("Vui lòng đăng nhập");
            setLocation(true);
            setLink("http://localhost:3000/login");
        }
    };

    return (
        <Modal
            open={true}
            onClose={() => setShowModal(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <IconButton onClick={() => setShowModal(false)} sx={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <Close />
                </IconButton>
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 ,textAlign:'center',fontWeight:'bold',fontSize:'24px'}}>
                    Cập nhật vai trò
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2,mt:2}}>
                        <TextField
                            label="Tên đăng nhập"
                            id="TenDangNhap"
                            name="TenDangNhap"
                            value={formData.TenDangNhap}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2, mt:1 }}>
                        <InputLabel id="role-label">Vai trò</InputLabel>
                        <Select
                            labelId="role-label"
                            id="IDVaiTro"
                            name="IDVaiTro"
                            value={formData.IDVaiTro}
                            onChange={handleChange}
                            label="Vai Trò"
                        >
                            <MenuItem value="1">Admin</MenuItem>
                            <MenuItem value="2">Employee</MenuItem>
                            <MenuItem value="3">User</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Button Lưu */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mt:2}}
                    >
                        Lưu
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}

export default UpdateRoleModal;
