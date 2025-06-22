import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Checkbox, Radio } from 'antd';
import toast from 'react-hot-toast';
import { Prices } from '../components/Prices';


function Home() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Get all categories 
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category');
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error in get all category");
        }
    }
    // Get all products 
    const getAllProducts = async () => {

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    // get total count 
    const getTotal = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/product-count');
            setTotal(data?.total);
            console.log("products.length:", products.length, "total:", total);
        } catch (error) {
            console.log(error);
        }
    }

    // call loadmore 
    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    // load more 
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            setLoading(false);
            console.log(error);

        }
    }

    // Filter product by category
    const handleFilter = (value, id) => {
        let all = [...checked,]
        if (value) {
            all.push(id);
        } else {
            all = all.filter(c => c !== id);
        }
        setChecked(all);
    }

    // call hare category
    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    // Calling the getProduct
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    // call filter product
    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    // Filter products 
    const filterProduct = async () => {
        try {
            const { data } = await axios.post('/api/v1/product/product-filters', { checked, radio });
            if (data.products) {
                setProducts(data?.products);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout title={'All Products - Best offers'}>
            <div className="container-fluid">
                <div className="container">
                    <div className="row mt-3">
                        <div className="col-md-3 ">
                            <h4 className='pt-5'>Filter By Category</h4>
                            <div className="d-flex flex-column ">
                                {categories?.map((c) => (
                                    <div className="mb-2" key={c._id}>
                                        <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                            {c.name}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                            {/* Price filter */}
                            <h4 className='mt-4'>Filter By Price</h4>
                            <div className="d-flex flex-column ">
                                <Radio.Group onChange={(e) => setRadio(e.target.value)} >
                                    {Prices?.map(p => (
                                        <div key={p._id} >
                                            <Radio value={p.array} >{p.name}</Radio>
                                        </div>
                                    ))}
                                </Radio.Group>
                            </div>
                            <div className="d-flex flex-column  ">
                                {/* <button className='btn btn-danger mt-4' onClick={() => window.location.reload()} >RESET FILTERS</button> */}
                                <button className="btn btn-danger shadow px-4 py-2 fw-bold rounded-pill w-75 mt-4" onClick={() => window.location.reload()}><i className="bi bi-exclamation-triangle me-2"></i>RESET FILTERS</button>
                            </div>
                        </div>

                        <div className="col-md-9">
                            <h1 className='text-center'>All Products</h1>
                            <div className="d-flex flex-wrap">
                                <div className="d-flex flex-wrap gap-4 justify-content-center mb-5">
                                    {products.map(p => (
                                        <motion.div key={p._id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.03 }}>
                                            <div className="card h-100 shadow-sm border-0" style={{ width: '18rem', transition: 'transform 0.3s ease' }}>
                                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top text-center" alt={p.name} style={{ height: '200px', objectFit: 'cover' }} />
                                                <div className="card-body">
                                                    <h5 className="card-title fw-bold">{p.name}</h5>
                                                    <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>{p.description.length > 30 ? p.description.slice(0, 30) + "..." : p.description}</p>
                                                    <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>${p.price}</p>
                                                    <button className='btn btn-primary text-center me-4' >More Details</button>
                                                    <button className='btn btn-secondary text-center' >Add To Cart</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className='m-2 p-3'>
                                {products && products.length < total && (
                                    <button className='btn btn-warning' onClick={(e) => { e.preventDefault(); setPage(page + 1); }}>
                                        {loading ? "Loading..." : "Loadmore"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home;

