import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';



const LoginWithOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otp, setOtp] = useState("");
 


  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOTP = async (e ) => {
    e.preventDefault();
    try {
      // Generate a random OTP
    //   const otp = Math.floor(1000 + Math.random() * 9000);
    //   const response = await axios.post('/api/send-otp', {
    //     phoneNumber: phoneNumber,
    //});
    const otp = Math.floor(1000 + Math.random() * 9000);

    const response = await axios.post("/send-otp", {
        phoneNumber: phoneNumber,
        otp: otp,
      });
    if (response.data.success) {
        alert(`OTP Sent to ${phoneNumber}`);
        setOtp(otp.toString()); // Store OTP for verification

    } else {
        alert("Failed to send OTP");
      }
    


      // Send OTP via Twilio
    //   const message = await client.messages.create({
    //     body: `Your OTP is ${otp}`,
    //     from: "+13344408387", // Your Twilio phone number
    //     to: `+91${phoneNumber}`, // User's phone number with country code
    //   });
    //   return message.sid; // Return the message SID if needed

    //   if (message.sid) {
    //     alert(`OTP Sent to ${phoneNumber}`);
    //     setOtp(otp.toString()); // Store OTP for verification
    //   } else {
    //     alert("Failed to send OTP");
    //   }
    } catch (error) {
    //   console.error(error);
    //   alert("Error sending OTP");
    }
  };

  const handleLoginWithOTP = (e) => {
    e.preventDefault();
    if (otp === enteredOtp) {
      navigate("/stock-entry");
      alert(`Logged in with OTP`);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login with OTP</h2>
      <form onSubmit={handleSendOTP}>
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneChange}
        />
        <button type="submit">Send OTP</button>
      </form>
      <form onSubmit={handleLoginWithOTP}>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={handleOtpChange}
        />
        <button type="submit">Login with OTP</button>
      </form>
    </div>
  );
};

export default LoginWithOTP;
