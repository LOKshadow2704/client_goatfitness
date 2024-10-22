import React from 'react';
import PaymentSuccess from '../../components/Payment_Order_Success/Payment_Order_Success'; 
import HeaderLogo from '../../components/Header_Logo/HeaderLogo';

const PaymentSuccessPage = () => {
  
  const orderId = "123456"; 
  const totalAmount = "2,500,000"; 
  const paymentMethod = "Thanh toán khi nhận hàng"; 
  const shippingAddress = "123 Đường ABC, Quận 1, TP.HCM"; 

  return (
<div>
      <HeaderLogo /> 
      <PaymentSuccess
        orderId={orderId}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        shippingAddress={shippingAddress}
      />
    </div>
  );
};

export default PaymentSuccessPage;
