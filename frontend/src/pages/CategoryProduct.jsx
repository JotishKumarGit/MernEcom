import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function CategoryProduct() {

    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    }


    // call getProById
    useEffect(() => {
        getProductByCat();
    }, []);

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className='text-center mt-4'>  Category :   {category?.name}</h1>
                    <h2 className='text-center'>All Products</h2>
                    <div className="d-flex flex-wrap justify-content-center">
                        <div className="d-flex flex-wrap gap-4 justify-content-center mb-5">
                            {products.map(p => (
                                <motion.div key={p._id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.03 }}>
                                    <div className="card h-100 shadow-sm border-0" style={{ width: '18rem', transition: 'transform 0.3s ease' }}>
                                        <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top text-center" alt={p.name} style={{ height: '200px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">{p.name}</h5>
                                            <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>{p.description.length > 30 ? p.description.slice(0, 30) + "..." : p.description}</p>
                                            <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>${p.price}</p>
                                            <button className='btn btn-primary text-center me-4' onClick={() => navigate(`/product/${p.slug}`)} >More Details</button>
                                            <button className='btn btn-secondary text-center' >Add To Cart</button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct;

