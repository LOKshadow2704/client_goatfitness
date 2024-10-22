import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneIcon from '@mui/icons-material/Done'; 
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import UserPackage from '../UserPackage/UserPackage';


const PaymentRegisterPTSuccess = ({ 
  registrationId, 
  service, 
  rentalPrice, 
  paymentStatus 
}) => {
  const navigate = useNavigate();

  const [showPTModal, setShowPTModal] = useState(false);

  // Các bước trong breadcrumb
  const steps = [
    'Chọn dịch vụ',
    'Nhập thông tin',
    'Hoàn tất đăng ký',
  ];

  return (
    <Box sx={{ padding:'20px'}}>
      <Stepper activeStep={2} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => (
                <DoneIcon sx={{ color: index === 2 ? 'green' : 'blue' }} />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ textAlign: 'center', padding: '20px', marginTop: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 100, color: 'green' }} />
        <Typography variant="h4" sx={{ marginTop: '13px', marginBottom: '10px' }}>
          Đăng ký thành công!
        </Typography>
        <Typography variant="body1">
          Chúc mừng bạn đã hoàn tất đăng ký gói tập thành công!
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          <strong>ID hóa đơn:</strong> {registrationId}<br />
          <strong>Hình thức thanh toán:</strong> {paymentStatus}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          Tên gói tập: <strong>{service}</strong><br />
          Giá: <strong>{rentalPrice}₫</strong>
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Bạn có thể theo dõi chi tiết trong mục <strong>Thông tin tài khoản / Thông tin gói tập</strong>. Để xem chi tiết hóa đơn thuê gói tập, vui lòng nhấn vào nút bên dưới.
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '20px', marginBottom: '30px', fontSize:'20px' }}>
          <strong>GOAT FITNESS</strong> rất vinh hạnh được đồng hành cùng bạn trên hành trình rèn luyện sức khỏe!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/info')} 
          >
            Tiếp tục tìm hiểu dịch vụ
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowPTModal(true)}
          >
            Chi tiết hóa đơn thuê gói tập
          </Button>
        </Box>
      </Box>
      {showPTModal && <UserPackage setShowModal={setShowPTModal} />}
    </Box>

  );
};

export default PaymentRegisterPTSuccess;
