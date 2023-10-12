import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");

  const [newErrors, setNewErrors] = useState({}); // newly a dded

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validate form fields
    let valid = true;
    const newErrors = {};

    if (!inputs.name) {
      valid = false;
      newErrors.name = " *Name is required";
    }

    if (!inputs.email) {
      valid = false;
      newErrors.email = " *Email is required";
    }

    if (!inputs.phoneNumber) {
      valid = false;
      newErrors.email = " *Number  is required";
    }

    if (inputs.phoneNumber.length !== 10) {
      valid = false;
      newErrors.phoneNumber = " *Phone Number must be 10 digits";
    }

    if (!inputs.password) {
      valid = false;
      newErrors.password = " *password  is required";
    }

    if (valid) {
      try {
        const response = await axios.post(
          "http://localhost:8800/api/auth/register",
          inputs
        );

        if (response.status === 200) {
          navigate("/login");
        } else {
          setErrors({
            ...errors,
            general: "Registration failed. Please try again.",
          });
        }
      } catch (err) {
        if (err.response && err.response.data) {
          setErrors({
            ...errors,
            general:
              err.response.data.error ||
              "Registration failed. Please try again.",
          });
        } else {
          setErrors({
            ...errors,
            general: "An unexpected error occurred. Please try again later.",
          });
          setNewErrors(newErrors);
        }
      }
    } else {
      // Update errors state if validation fails
      setErrors(newErrors);
      setNewErrors(newErrors);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <p>Create an account Be a part of Extrovertism</p>
          <span> you Do have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error">{errors.name}</div>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            {errors.password && <div className="error">{errors.password}</div>}

            <input
              type="text"
              placeholder="PhoneNumber"
              value={inputs.phoneNumber}
              onChange={(e) =>
                setInputs({ ...inputs, phoneNumber: e.target.value })
              }
              maxLength="10"
              required
         
            />

            {errors.phoneNumber && (
              <div className="error">{errors.phoneNumber}</div>
            )}

            <select name="role" onChange={handleChange} value={inputs.role}>
              <option value="">Select User</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.general && <div className="error">{errors.general}</div>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
