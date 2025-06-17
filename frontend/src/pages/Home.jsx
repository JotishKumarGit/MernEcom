import React from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../Context/Auth';


function Home() {

    const [auth,setAuth] = useAuth();



    return (
        <Layout title={'Best offers'}>
            <h2>Home</h2>
            <pre>{JSON.stringify(auth,null,4)}</pre>
        </Layout>
    )
}

export default Home;

