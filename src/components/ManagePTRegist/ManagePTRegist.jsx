import React, { useState } from 'react';
import { Modal, Box, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5,
    p: 4,
};

function ManagePTRegistration({ setShowModal }) {
    const initialData = {
        fullName: 'Nguyễn Văn A',
        serviceID: 'Gym',
        certificates: 'Chứng chỉ huấn luyện viên quốc gia',
        desiredRent: '5000000',
        status: 'Từ chối',  
    };

    const [formData] = useState(initialData);  

    const getStatusColor = (status) => {
        if (status === 'Đang chờ xử lý') return 'warning.main';  
        if (status === 'Từ chối') return 'error.main';  
        if (status === 'Chấp nhận') return 'success.main';  
        return 'text.primary';  
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

                <Typography variant="h6" id="modal-title" textAlign="center" mb={2}>
                    Quản lý thông tin đăng ký HLV
                </Typography>

                <form>
                    <TextField
                        id="fullName"
                        label="Họ và tên"
                        fullWidth
                        margin="normal"
                        value={formData.fullName}
                        disabled
                    />
                    <TextField
                        id="serviceID"
                        label="Dịch vụ"
                        value={formData.serviceID}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        id="certificates"
                        label="Chứng chỉ"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={formData.certificates}
                        disabled
                    />
                    <TextField
                        id="desiredRent"
                        label="Giá thuê mong muốn"
                        fullWidth
                        margin="normal"
                        value={formData.desiredRent}
                        disabled
                    />
                    <Typography 
                        id="status"
                        variant="body1"
                        sx={{
                            fontWeight: 'bold',
                            paddingTop: 2,
                            color: (theme) => getStatusColor(formData.status), 
                        }}
                    >
                        Trạng thái đơn đăng ký: {formData.status}
                    </Typography>
                </form>
            </Box>
        </Modal>
    );
}

export default ManagePTRegistration;
