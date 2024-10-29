import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneIcon from '@mui/icons-material/Done'; // Icon dấu tích
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

const PaymentSuccess = ({ orderId, totalAmount, paymentMethod, shippingAddress }) => {
  const navigate = useNavigate();

  // Tính toán ngày giao hàng dự kiến (3 ngày sau ngày hiện tại)
  const currentDate = new Date();
  const estimatedDeliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 3)).toLocaleDateString();

  // Các bước trong breadcrumb
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
                <DoneIcon sx={{ color: index === 2 ? 'green' : 'blue' }} />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ textAlign: 'center', padding: '20px', marginTop: '30px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 100, color: 'green' }} />
        <Typography variant="h4" sx={{ marginTop: '20px', marginBottom: '10px' }}>
          Đặt hàng thành công!
        </Typography>
        <Typography variant="body1">
          Bạn đã đặt hàng thành công đơn hàng mã <strong>{orderId}</strong> trị giá <strong>{totalAmount}₫</strong>, với phương thức thanh toán là <strong>{paymentMethod}</strong>.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          Đơn hàng sẽ được giao đến địa chỉ <strong>{shippingAddress}</strong> sau khi được xác nhận. Thời gian giao hàng dự kiến trước ngày <strong>{estimatedDeliveryDate}</strong>.
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Bạn có thể theo dõi đơn hàng trong mục <strong>Thông tin tài khoản / Đơn hàng</strong> hoặc bấm vào nút dưới để xem chi tiết đơn hàng.
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '20px', marginBottom: '30px', fontSize:'20px' }}>
          <b>GOAT FITNESS</b> luôn sẵn sàng phục vụ bạn!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/shop')}
          >
            Tiếp tục mua sắm
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/PurchaseOrder`)}
          >
            Chi tiết đơn hàng
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;
