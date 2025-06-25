import React from 'react';
import Layout from '../components/Layout/Layout';
import UseCategory from '../hooks/UseCategory';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Categories() {
    const categories = UseCategory();

    return (
        <Layout title={"Categories - All Categories"}>
            <div className="container py-5">
                <h2 className="text-center mb-4">Explore Our Categories</h2>
                <div className="row justify-content-center">
                    {categories.map((c, index) => (
                        <div key={c._id} className="col-md-4 col-sm-6 mb-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }} className="card shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                    <h5 className="card-title mb-3">{c.name}</h5>
                                    <Link to={`/category/${c.slug}`} className="btn btn-outline-primary">
                                        View Products
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Categories;
