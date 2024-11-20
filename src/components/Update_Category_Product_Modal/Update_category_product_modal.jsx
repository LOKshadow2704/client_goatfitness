import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateCategoryModal({ data, setShowModal }) {
    const [formData, setFormData] = useState({ ...data });
    const [changedData, setChangedData] = useState({});
    const { setError, setMessage, setSuccess } = useAnnouncement();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setChangedData({ ...changedData, [name]: value });
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
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };

            const data = {
                data: changedData,
                IDLoaiSanPham: formData.IDLoaiSanPham
            };

            axios.put('http://localhost:8080/Backend/employee/category/update', data, { headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setSuccess(true);
                        setMessage("Cập nhật thành công");
                        setShowModal(false);
                    } else {
                        throw new Error("Lấy thông tin thất bại");
                    }
                })
                .catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                });
        }
    };

    return (
        <Dialog open={true} onClose={() => setShowModal(false)} fullWidth maxWidth="xs">
            <DialogTitle sx={{fontWeight: 'bold', textAlign: 'center', fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom:'10px'}}>
                Cập nhật tên loại sản phẩm
                <IconButton 
                    onClick={() => setShowModal(false)}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="ID loại sản phẩm"
                        variant="outlined"
                        fullWidth
                        name="IDLoaiSanPham"
                        value={formData.IDLoaiSanPham}
                        onChange={handleChange}
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Tên loại sản phẩm"
                        variant="outlined"
                        fullWidth
                        name="TenLoaiSanPham"
                        value={formData.TenLoaiSanPham}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" style={{marginTop:'10px', width:'150px', marginLeft:'30%'}}>
                        Lưu
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateCategoryModal;
