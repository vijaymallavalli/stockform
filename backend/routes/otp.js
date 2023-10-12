// // backend/routes/otp.js
// import express from 'express';
// import twilio from 'twilio';

// const router = express.Router();

// const client = twilio('accountSid', 'authToken');

// router.post('/send-otp', async (req, res) => {
//   const phoneNumber = req.body.phoneNumber;

//   try {
//     const otp = Math.floor(1000 + Math.random() * 9000);
//     const message = await client.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: "+13344408387", // Your Twilio phone number
//       to: `+91${phoneNumber}`, // User's phone number with country code
//     });

//     if (message.sid) {
//       res.json({ success: true, otp: otp });
//     } else {
//       res.json({ success: false, error: "Failed to send OTP" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, error: "Error sending OTP" });
//   }
// });

// // export default router;
