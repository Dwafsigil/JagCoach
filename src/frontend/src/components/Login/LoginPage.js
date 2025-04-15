import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) {
                setErrorMessage(result.message || "Something went wrong");
                return;
            }

            setErrorMessage(''); // Clear any previous error

            if (isLogin) {
                localStorage.setItem("userEmail", formData.email);
                window.location.href = "/";
            } else {
                alert("Registration successful. You can now log in.");
                setIsLogin(true);
                setFormData({ name: '', email: '', password: '' });
            }

        } catch (error) {
            setErrorMessage("Server error. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <img src="/JagCoach.png" alt="JagCoach Logo" className="login-logo" />
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
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
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}
                <button className="login-button" type="submit">
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>
            <div className="toggle">
                <p>Already Have an Account</p>
                <button onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMessage('');
                }}>
                    {isLogin ? "Sign Up" : "Login"}
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
