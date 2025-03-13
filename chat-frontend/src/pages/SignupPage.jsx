import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";

const SignupPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const requestData = {
      mobileNumber,
      name,
      password,
      description,
      profile, // Adding profile as text
    };

    try {
      await axios.post("/create", requestData);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign up. Try again.");
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div>
          <label htmlFor="profile">Profile:</label>
          <input
            type="text"
            id="profile"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder="Enter your profile details (e.g., profession)"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate("/login")} className="login-button">
        Back to Login
      </button>
    </div>
  );
};

export default SignupPage;
