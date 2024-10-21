import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; 
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HeaderLogo from '../../components/Header_Logo/HeaderLogo'; 
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

const OrderError = () => {
  const navigate = useNavigate();

  
  const steps = [
    'Chọn phương thức thanh toán',
    'Nhập thông tin thanh toán',
    'Hoàn tất giao dịch',
  ];

  return (
    <Box sx={{ padding: '20px' }}>
      <Stepper activeStep={2} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => (
                <ErrorOutlineIcon sx={{ color: index === 2 ? 'red' : 'blue' }} />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ textAlign: 'center', padding: '20px', marginTop: '30px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'red' }} />
        <Typography variant="h4" sx={{ marginTop: '20px', marginBottom: '10px' }}>
          Thanh toán thất bại
        </Typography>
        <Typography variant="body1">
          Đơn hàng của quý khách không thể hoàn tất thanh toán.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          Số thẻ hoặc tài khoản không hợp lệ.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/order')}
          >
            Quay lại trang thanh toán
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const PaymentFailedPage = () => {
  return (
    <div>
      <HeaderLogo /> 
      <OrderError />
    </div>
  );
};

export default PaymentFailedPage;
