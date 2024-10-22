import React from 'react';
import RegisterPackGymPaymentSuccess from '../../components/Payment_Register_Packgym_Success/Payment_Register_Packgym_Success'; 
import HeaderLogo from '../../components/Header_Logo/HeaderLogo';

const RegisterPackGymPayment = () => {
  
  const registrationId = "123456"; 
  const trainerName = "Nguyễn Văn A"; 
  const service = "Tập Gym 1 tháng"; 
  const rentalPrice = "1,000,000"; 
  const paymentStatus = "Thanh toán tại phòng tập"; 

  return (
    <div>
      <HeaderLogo /> 
      <RegisterPackGymPaymentSuccess
        registrationId={registrationId}
        service={service}
        rentalPrice={rentalPrice}
        paymentStatus={paymentStatus}
      />
    </div>
  );
};

export default RegisterPackGymPayment;
