import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';


function Products() {

    const [products, setProducts] = useState([]);


    // Get all products
    const getAllProduct = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/get-product');
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error("Error in get all product");
        }
    }

    // life cycle method
    useEffect(() => {
        getAllProduct();
    }, []);

    return (
        <Layout title={'Dashboard - Products'}>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    <h1 className='text-center'>All Products List</h1>
                    <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center mb-3">
                        {products?.map(p => (
                            <Link to={`/dashboard/admin/product/${p.slug}`} className='text-decoration-none' key={p._id} >
                                <div className="card" style={{ width: '18rem' }}>
                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products;
