import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function ProductDetails() {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/relative-product/${pid}/${cid}`);
            setRelatedProduct(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="container py-5">
                {product && product?._id ? (
                    <div className="row g-5 align-items-center">
                        <motion.div className="col-md-6" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <div className="border rounded p-3 bg-light">
                                <img src={`/api/v1/product/product-photo/${product?._id}`} className="img-fluid rounded" alt={product.name} style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }} />
                            </div>
                        </motion.div>

                        <motion.div className="col-md-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <div className="bg-white p-4 rounded shadow-sm">
                                <h2 className="mb-3 fw-bold">Product Details</h2>
                                <h4 className="text-primary fw-semibold">Name: {product.name}</h4>
                                <p className="text-muted">Description: {product.description}</p>
                                <h5 className="text-success">Price: ₹{product.price}</h5>
                                <p className="text-info">Category: {product.category?.name}</p>
                                <button className="btn btn-dark mt-3 px-4 py-2">Add To Cart</button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center py-5 fs-4">Loading...</div>
                )}

                <hr className="my-5" />

                <div className="row">
                    <h3 className="mb-4 text-center fw-bold">Similar Products</h3>
                    {relatedProduct.length < 1 && <p className="text-center">No Similar Product Found</p>}

                    <div className="d-flex flex-wrap justify-content-center gap-4">
                        {relatedProduct?.map(p => (
                            <motion.div key={p._id} className="card shadow-sm border-0" style={{ width: '18rem' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05 }}>
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                                        {p.description.length > 30 ? p.description.slice(0, 30) + "..." : p.description}
                                    </p>
                                    <p className="text-success fw-semibold">₹{p.price}</p>
                                    <button className="btn btn-outline-dark w-100">Add To Cart</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProductDetails;
