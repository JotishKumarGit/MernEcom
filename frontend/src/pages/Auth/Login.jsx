import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Style.css';
import { useAuth } from '../../Context/Auth';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:8080/api/v1/auth/login`, { email, password });
            if (res.data.success) {
                toast.success(res && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                })
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || '/');
            }
            else {
                toast.error(res.data.message);
            }
            console.log(res);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Layout title={"Login-hare"}>
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
                    <h2 className="text-center mb-3 text-primary">Login Here</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email"className="form-control"placeholder="Enter your email"value={email}onChange={(e) => setEmail(e.target.value)}required/>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input type="password"className="form-control"placeholder="Enter your password"value={password}onChange={(e) => setPassword(e.target.value)}required/>
                        </div>
                        {/* Forgot Password Link */}
                        <div className="mb-3 text-end">
                            <span onClick={() => navigate('/forgot-password')} style={{ color: '#0d6efd', cursor: 'pointer', fontSize: '0.9rem' }}>Forgot Password?</span>
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Login;
