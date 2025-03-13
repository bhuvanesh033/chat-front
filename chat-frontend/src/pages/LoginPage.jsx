import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api"; // Ensure axios instance is configured correctly

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear any previous error

    try {
      console.log("Sending login request with:", { phone_number: mobileNumber, password }); // Debug log

      const response = await axios.post("/login", {
        phone_number: mobileNumber, // Match backend key
        password,
      });

      const { token } = response.data;
      console.log("Login successful:", response.data); // Debug log for response
      localStorage.setItem("token", token);
      localStorage.setItem("userPhoneNumber", mobileNumber);
      alert("Login successful!");
      navigate("/chat"); // Redirect to chat page after successful login
    } catch (err) {
      console.error("Login error:", err); // Debug log for error
      setError(err.response?.data?.message || "Invalid mobile number or password.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const navigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"} {/* Show loading text when submitting */}
        </button>
      </form>
      <button onClick={navigateToSignup} className="signup-button">
        Sign Up
      </button>
    </div>
  );
};

export default LoginPage;
