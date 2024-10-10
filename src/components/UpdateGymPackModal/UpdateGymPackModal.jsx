import React, { useState } from "react";
import { IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, FormControl, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateGymPackModal({ data, setShowModal }) {
    const { setError, setMessage, setSuccess } = useAnnouncement();
    const [formData, setFormData] = useState({
        IDGoiTap: data.IDGoiTap,
        TenGoiTap: data.TenGoiTap,
        ThoiHan: data.ThoiHan,
        Gia: data.Gia
    });

    const checkFormData = (formData) => {
        let nonEmptyFieldsCount = 0;
        for (const key in formData) {
            if (formData[key] !== "" && formData[key] !== data[key]) {
                nonEmptyFieldsCount++;
            }
            if (nonEmptyFieldsCount >= 1) {
                return true;
            }
        }
        return false;
    };

    const removeEmptyFields = (formData) => {
        const filteredFormData = {};
        for (const key in formData) {
            if (formData[key] !== "") {
                filteredFormData[key] = formData[key];
            }
        }
        return filteredFormData;
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
                const cleanData = removeEmptyFields(formData);
                const jwt = findCookie('jwt');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt,
                    'PHPSESSID': findCookie("PHPSESSID")
                };
                axios.put('http://localhost:8080/Backend/gympack/update', cleanData, { headers: headers })
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
                        setMessage(error.response.data.error);
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
        sx={{ '& .MuiDialog-paper': { width: '400px', maxWidth: '90%' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom:'10px' }}>
                Cập nhật gói tập
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
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Tên gói tập"
                            id="TenGoiTap"
                            name="TenGoiTap"
                            value={formData.TenGoiTap}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Thời gian hết hạn (ngày)"
                            type="number"
                            id="ThoiHan"
                            name="ThoiHan"
                            value={formData.ThoiHan}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Giá(VNĐ)"
                            type="number"
                            id="Gia"
                            name="Gia"
                            value={formData.Gia}
                            onChange={handleChange}
                            fullWidth
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

export default UpdateGymPackModal;
