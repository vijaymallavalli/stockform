import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import twilio from 'twilio';


// const generateOTP = () => {
//   return Math.floor(1000 + Math.random() * 9000);
// };
   

export const register = (req, res) => {
  // Check if the user already exists
  const q = "SELECT * FROM users WHERE email = ? OR phoneNumber = ?";


   
    // console.log('Before query execution');
  db.query(q, [req.body.email, req.body.phoneNumber], (err, data) => {
    // console.log('After query execution');

    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
      const existingUser = data.find(user => user.email === req.body.email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      const existingPhoneNumberUser = data.find(user => user.phoneNumber === req.body.phoneNumber);
      if (existingPhoneNumberUser) {
        return res.status(409).json({ error: 'User with this phone number already exists' });
      }
    }

    // If the user does not exist, create a new user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users (name, email, password, phoneNumber, role) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.name,
      req.body.email,
      hashedPassword,
      req.body.phoneNumber,
      req.body.role || 'user',
    ];

    db.query(insertQuery, values, (insertErr) => {
      if (insertErr) {
        return res.status(500).json({ error: 'User registration failed' });
      }

      return res.status(200).json({ message: 'User has been registered successfully' });
    });
  });
};

  export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ? OR phoneNumber = ?";
  
    db.query(q, [req.body.email, req.body.email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("Email/Phone number not found!");
  
      const checkPassword = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
  
      if (!checkPassword)
        return res.status(400).json("Wrong password or username!");
  
      // Assuming you have a 'role' field in your user data
      const userRole = data[0].role;
  
      const token = jwt.sign({ id: data[0].id }, "secretkey");
  
      const { password, ...others } = data[0];
  
      res.cookie("accessToken", token, {
        httpOnly: true,
      });
  
      // Set a 'userRole' cookie based on the user's role
      res.cookie("userRole", userRole, {
        httpOnly: true,
      });
      res.status(200).json(others);
    });
  };
  
  

export const logout = (req, res) => {
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};
 
export const checkDate = (req, res) => {
  const enteredDate = req.params.date;

  const sql = 'SELECT COUNT(*) AS count FROM products WHERE entered_date = ?';

  db.query(sql, [enteredDate], (err, result) => {
    if (err) {
      console.error('Error checking date:', err);
      res.status(500).json({ error: 'Error checking date' });
    } else {
      const dateExists = result[0].count > 0;

      if (dateExists) {
        res.status(200).json({message:false})
      } else {
        res.status(200).json({message:true });
      }
    }
  });

};

export const changePassword = (req, res) => {

  const { currentPassword, newPassword, confirmPassword } = req.body;




  // Retrieve the user's current hashed password from the database based on the user's ID or email (depending on your authentication method).

  const userId = req.userId; // Assuming you have user information in the request after authentication.

console.log(userId)




// console.log(req)

  // Query the database to get the current hashed password for the user

  const getPasswordQuery = 'SELECT password FROM users WHERE id = ?'; // Adjust this query based on your database structure




  db.query(getPasswordQuery, [userId], (err, results) => {

    if (err) {

      return res.status(500).json({ error: 'Internal Server Error' });

    }




    if (results.length !== 1) {

      return res.status(404).json({ error: 'User not found' });

    }




    const currentHashedPassword = results[0].password;




    // Compare the current password in the database with the provided current password

    bcrypt.compare(currentPassword, currentHashedPassword, (compareErr, isMatch) => {

      if (compareErr) {

        return res.status(500).json({ error: 'Internal Server Error' });

      }




      if (!isMatch) {

        return res.status(401).json({ error: 'Current password is incorrect' });

      }




      // If the current password is correct, check if the new password and confirm password match

      if (newPassword !== confirmPassword) {

        return res.status(400).json({ error: 'New password and confirm password do not match' });

      }




      // Hash and update the new password in the database

      bcrypt.genSalt(10, (saltErr, salt) => {

        if (saltErr) {

          return res.status(500).json({ error: 'Internal Server Error' });

        }




        bcrypt.hash(newPassword, salt, (hashErr, hashedPassword) => {

          if (hashErr) {

            return res.status(500).json({ error: 'Internal Server Error' });

          }




          // Update the user's password in the database

          const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';




          db.query(updatePasswordQuery, [hashedPassword, userId], (updateErr) => {

            if (updateErr) {

              return res.status(500).json({ error: 'Password update failed' });

            }




            return res.status(200).json({ message: 'Password has been updated successfully' });

          });

        });

      });

    });

  });

};
