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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = {
            certificates,
            serviceID,
            desiredRent,
        };

        axios.post('http://localhost:8080/Backend/PT/register', data)
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
                setError(true);
                setMessage('Đăng ký thất bại');
            });
    };

    return (
        <Modal
            open={true}  // Modal luôn mở khi component được render, có thể thay đổi bằng trạng thái open
            onClose={() => setShowModal(false)}  // Đóng modal khi người dùng nhấn ra ngoài modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                {/* Nút đóng modal với biểu tượng 'x' */}
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
                            <MenuItem value="gym">Gym</MenuItem>
                            <MenuItem value="yoga">Yoga</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="desiredRent"
                        label="Giá thuê mong muốn"
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
