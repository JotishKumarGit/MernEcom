import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import UserMenu from '../components/Layout/UserMenu';
import { useAuth } from '../Context/Auth';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../styles/Style.css';


function Profile() {

    // context
    const [auth, setAuth] = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // get user data
    useEffect(() => {
        const { email, name, phone, address, password } = auth?.user || {};
        setName(name);
        setEmail(email);
        setPhone(phone);
        setAddress(address);
        setPassword(password);

    }, [auth?.user])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/api/v1/auth/profile`, { name, email, password, phone, address });
            if (data?.error) {
                toast.error(data?.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser, token: data.token });
                let ls = localStorage.getItem('auth');
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                ls.token = data.token;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Layout title={"Dashboard - User-Profile"}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="container d-flex justify-content-center align-items-center min-vh-100">
                            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
                                <h2 className="text-center mb-3 text-primary">User Profile</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-2">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" placeholder="Enter your name" value={name || ''} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" placeholder="Enter your email" value={email || ''} onChange={(e) => setEmail(e.target.value)} disabled />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" placeholder="Enter your password" value={password || ''} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Phone Number</label>
                                        <input type="text" className="form-control" placeholder="Enter your number" value={phone || ''} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address</label>
                                        <input type="text" className="form-control" placeholder="Enter your address" value={address || ''} onChange={(e) => setAddress(e.target.value)} />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary">Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile;
