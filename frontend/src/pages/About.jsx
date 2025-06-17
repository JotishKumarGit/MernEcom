import React from 'react'
import Layout from '../components/Layout/Layout';

function About() {
    return (
        <Layout title={"Abput us - Ecommer app"}>
            <div className="container">
                <div className="row py-5 ">
                    <div className="col-md-6 ">
                        <img src="/images/contactus.jpeg" alt="contactus" style={{ width: '100%' }} />
                    </div>
                    <div className="col-md-6">
                        <div className="mt-5">
                        <h1 className="text-start">About Us</h1>
                        <p className="text-justify mt-2">any query and info about prodduct feel free to call anytime we 24X7 vaialible</p>
                        <p className="text-justify mt-2">any query and info about prodduct feel free to call anytime we 24X7 vaialible</p>
                        <p className="text-justify mt-2">any query and info about prodduct feel free to call anytime we 24X7 vaialible</p>
                    </div>
                </div>
                </div>
            </div>
        </Layout>
    )
}

export default About;
