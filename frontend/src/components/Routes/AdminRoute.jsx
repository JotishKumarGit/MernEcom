import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/Auth';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Spiner from '../Spiner';

function AdminRoute() {

    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            console.log("Checking auth with token:", auth?.token);
            try {
                const res = await axios.get('/api/v1/auth/admin-auth');
                console.log("Auth check response:", res.data);
                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (err) {
                console.error("Auth check failed", err);
                setOk(false);
            }
        };
        if (auth?.token) authCheck();
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spiner path="" />;

    return (
        <div>AdminRoute</div>
    )
}

export default AdminRoute;


