import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useAnnouncement } from '../../contexts/Announcement';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24, 
    borderRadius: 5,
    p: 4,
};

function RegisterPT({ setShowModal }) {
    const [certificates, setCertificates] = useState('');
    const [serviceID, setServiceID] = useState('');
    const [desiredRent, setDesiredRent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const jwt = findCookie('jwt');
        if (!jwt) {
            setIsLoading(false);
            setError(true);
            setMessage('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
            return;
        }

        if (!certificates || !serviceID || !desiredRent) {
            setIsLoading(false);
            setError(true);
            setMessage('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        const data = {
            ChungChi: certificates,  
            DichVu: serviceID,       
            GiaThue: desiredRent,    
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
            'PHPSESSID': findCookie("PHPSESSID"),
        };

        axios.post('http://localhost:8080/Backend/user/register_pt', data, { headers })
            .then(response => {
                setIsLoading(false);
                setSuccess(true);
                setMessage('Đăng ký thành công!');
                setLocation(true);
                setLink("http://localhost:3000/PT");  
                setShowModal(false);  
            })
            .catch(error => {
                setIsLoading(false);
                const errorMessage = error.response?.data?.error || 'Đăng ký thất bại';
                setError(true);
                setMessage(errorMessage);
            });
    };

    return (
        <Modal
            open={true}  
            onClose={() => setShowModal(false)}  
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <IconButton
                    onClick={() => setShowModal(false)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        cursor: 'pointer',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <h3 id="modal-title" style={{textAlign:'center',marginBottom:'10px'}}>Đăng ký làm huấn luyện viên</h3>
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="certificates"
                        label="Chứng chỉ"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={certificates}
                        onChange={(e) => setCertificates(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="service-label">Dịch vụ</InputLabel>
                        <Select
                            labelId="service-label"
                            id="serviceID"
                            value={serviceID}
                            onChange={(e) => setServiceID(e.target.value)}
                            label="Dịch vụ"
                        >
                            <MenuItem value=""><em>Vui lòng lựa chọn dịch vụ</em></MenuItem>
                            <MenuItem value="Gym">Gym</MenuItem>
                            <MenuItem value="Yoga">Yoga</MenuItem>
                            <MenuItem value="Boxing">Boxing</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="desiredRent"
                        label="Giá thuê mong muốn/ giờ"
                        fullWidth
                        margin="normal"
                        value={desiredRent}
                        onChange={(e) => setDesiredRent(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang gửi...' : 'Gửi'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
}

export default RegisterPT;
