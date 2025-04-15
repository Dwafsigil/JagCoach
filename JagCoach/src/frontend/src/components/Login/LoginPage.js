import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    // Form input values (name, email, password)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    // Error message shown below the form
    const [errorMessage, setErrorMessage] = useState('');
    // Called when any input field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Called when the form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Decide the API endpoint 
        const endpoint = isLogin ? '/login' : '/register';

        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            // Send data to the backend
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            // If login/register fails, show the message
            if (!res.ok) {
                setErrorMessage(result.message || "Something went wrong");
                return;
            }

            setErrorMessage('');

            if (isLogin) {
                // Store user email in localStorage and go to main page
                localStorage.setItem("userEmail", formData.email);
                window.location.href = "/";
            } else {
                // If registration was successful, show alert and switch to login 
                alert("Registration successful. You can now log in.");
                setIsLogin(true); // go back to login mode
                setFormData({ name: '', email: '', password: '' }); 
            }

        } catch (error) {
            setErrorMessage("Server error. Please try again.");
        }
    };

    return (
        <div className="login-container">
            {/* JagCoach logo */}
            <img src="/JagCoach.png" alt="JagCoach Logo" className="login-logo" />

            {/* Page title */}
            <h2>{isLogin ? "Login" : "Register"}</h2>

            {/* Form for login or registration */}
            <form onSubmit={handleSubmit}>
                {/* Show name field only in register mode */}
                {!isLogin && (
                    <>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                {/* Email input */}
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {/* Password input */}
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {/* Show error message below inputs if there is one */}
                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}

                {/* Main submit button */}
                <button className="login-button" type="submit">
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>

            {/* Text and button to switch between login/register modes */}
            <div className="toggle">
                <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        className="toggle-button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrorMessage(''); 
                        }}
                    >
                        {isLogin ? " Sign Up" : " Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
