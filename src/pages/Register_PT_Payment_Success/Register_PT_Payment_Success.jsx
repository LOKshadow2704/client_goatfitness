import React from 'react';
import RegisterPTPaymentSuccess from '../../components/Payment_Register_PT_Success/Paymen_Register_PT_Success'; 
import HeaderLogo from '../../components/Header_Logo/HeaderLogo';

const RegisterPTPayment = () => {
  
  const registrationId = "123456"; 
  const trainerName = "Nguyễn Văn A"; 
  const service = "Tập Gym 1 tháng"; 
  const rentalPrice = "1,000,000"; 
  const paymentStatus = "Thanh toán tại phòng tập"; 

  return (
    <div>
      <HeaderLogo /> 
      <RegisterPTPaymentSuccess
        registrationId={registrationId}
        trainerName={trainerName}
        service={service}
        rentalPrice={rentalPrice}
        paymentStatus={paymentStatus}
      />
    </div>
  );
};

export default RegisterPTPayment;
