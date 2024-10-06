import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import Snackbar from "@mui/material/Snackbar";

function AddPackGym({ data, setShowModal }) {
    const [formData, setFormData] = useState({
        TenGoiTap: "",
        ThoiHan: "",
        Gia: ""
    });
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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

        const isLogin = findCookie("jwt");
        if (isLogin) {
            const { TenGoiTap, ThoiHan, Gia } = formData;
            if (!TenGoiTap || !ThoiHan || !Gia) {
                setError(true);
                setMessage("Vui lòng điền đầy đủ thông tin");
                setSnackbarOpen(true);
                return;
            }
            if (isNaN(ThoiHan) || ThoiHan <= 0) {
                setError(true);
                setMessage("Thời hạn phải là một số dương");
                setSnackbarOpen(true);
                return;
            }
            if (isNaN(Gia) || Gia <= 0) {
                setError(true);
                setMessage("Giá phải là một số dương");
                setSnackbarOpen(true);
                return;
            }

            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };

            axios.post('http://localhost:8080/Backend/gympack/add', formData, { headers: headers })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Thêm gói tập thành công!");
            setShowModal(false);
            setSnackbarOpen(true);
        } else {
            throw new Error("Đăng ký gói tập thất bại");
        }
    })
                .catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                    setSnackbarOpen(true);
                });
        } else {
            setError(true);
            setMessage("Vui lòng đăng nhập!");
            setLocation(true);
            setLink("http://localhost:3000/login");
        }
    };

    return (
        <>
            <Dialog open={true} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth sx={{ height: '600px' }}>
                <DialogTitle sx={{fontWeight: 'bold', textAlign: 'center', fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px',marginBottom:'10px'}}>
                  Thêm gói tập mới
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
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Tên gói tập"
                            name="TenGoiTap"
                            type="text"
                            value={formData.TenGoiTap}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Thời hạn(ngày)"
                            name="ThoiHan"
                            type="number"
                            value={formData.ThoiHan}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Giá(VNĐ)"
                            name="Gia"
                            type="number"
                            value={formData.Gia}
                            onChange={handleChange}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={setMessage}
            />
        </>
    );
}

export default AddPackGym;
