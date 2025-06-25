import React from 'react';
import Layout from '../components/Layout/Layout';
import UserMenu from '../components/Layout/UserMenu';
import { useAuth } from '../Context/Auth';

function Dashboard() {
    const [auth] = useAuth();
    return (
        <Layout title={"Dashboard - User-Dashboard"} >
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card w-75 p-3">
                            <h3>User Name : {auth?.user?.name}</h3>
                            <h3>User Email : {auth?.user?.email}</h3>
                            <h3>User Address : {auth?.user?.address}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;

