import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import "./SignupPage.css";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        mobileNumber: "",
        name: "",
        password: "",
        description: "",
        profile: null
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            profile: e.target.files[0]
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const data = new FormData();
        data.append("phone_number", formData.mobileNumber);
        data.append("name", formData.name);
        data.append("password", formData.password);
        data.append("description", formData.description);
        if (formData.profile) {
            data.append("profile", formData.profile);
        }

        try {
            const response = await axios.post("/create", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Signup successful:", response.data);
            alert("Account created successfully! Please login.");
            navigate("/");
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to sign up. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number:</label>
                    <input
                        type="text"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="name">Name (lowercase):</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {/* <small>8-12 characters with at least one number and special character</small> */}
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        maxLength="100"
                        required
                    />
                    {/* <small>Max 100 characters</small> */}
                </div>
                
                <div className="form-group">
                    <label htmlFor="profile">Profile Image:</label>
                    <input
                        type="file"
                        id="profile"
                        name="profile"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                    {/* <small>Accepted formats: JPEG, PNG, GIF, WEBP (max 5MB)</small> */}
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={isSubmitting ? "submitting" : ""}
                >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                </button>
            </form>
            
            <button 
                onClick={() => navigate("/")} 
                className="login-button"
            >
                Back to Login
            </button>
        </div>
    );
};

export default SignupPage;