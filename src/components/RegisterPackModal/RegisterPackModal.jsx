import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function RegisterPackModal({ setShowModal }) {
    const [formData, setFormData] = useState({
        SDT: "",
        IDGoiTap: "",
        ThoiHan: ""
    });
    const [data, setData] = useState([]); 
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();

    useEffect(() => {
        axios.get("http://localhost:8080/Backend/gympack/")
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error fetching gym packs data:", error);
            });
    }, []); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        if (name === "SDT" && value.length > 0 && value.charAt(0) !== '0') {
            setError(true);
            setMessage("Số điện thoại phải bắt đầu bằng số 0");
            return;
        }

        if (name === "IDGoiTap") {
            const selectedPack = data.find(pack => pack.IDGoiTap === parseInt(value));
            if (selectedPack) {
                updatedFormData.ThoiHan = selectedPack.ThoiHan;
            } else {
                updatedFormData.ThoiHan = "";
            }
        }

        setFormData(updatedFormData);
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
            if (!formData.SDT || !formData.IDGoiTap) {
                setError(true);
                setMessage("Vui lòng điền đầy đủ thông tin");
                return;
            }
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.post('http://localhost:8080/Backend/gympack/registerByEmployee', formData, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setSuccess(true);
                        setMessage("Đăng ký thành công!");
                        setShowModal(false);
                    } else {
                        throw new Error("Đăng ký thất bại");
                    }
                })
                .catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                });
        } else {
            setError(true);
            setMessage("Vui lòng đăng nhập!");
            setLocation(true);
            setLink("http://localhost:3000/login");
        }
    };

    return (
        <Dialog open={true} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth sx={{ height: '600px' }}>
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                Đăng ký mới
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
                        label="Số điện thoại"
                        name="SDT"
                        type="text"
                        inputProps={{ maxLength: 11, minLength: 10, pattern: "[0-9]*" }}
                        value={formData.SDT}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="product-select-label">Loại sản phẩm</InputLabel>
                        <Select
                            labelId="product-select-label"
                            name="IDGoiTap"
                            value={formData.IDGoiTap}
                            onChange={handleChange}
                            label="Loại sản phẩm"
                        >
                            <MenuItem value="">
                                <em>Chọn loại sản phẩm</em>
                            </MenuItem>
                            {data.map((value) => (
                                <MenuItem key={value.IDGoiTap} value={value.IDGoiTap}>
                                    {value.TenGoiTap}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowModal(false)}>Hủy</Button>
                <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RegisterPackModal;
