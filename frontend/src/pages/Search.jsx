import React from 'react';
import Layout from '../components/Layout/Layout';
import { useSearch } from '../Context/Search';
import { motion } from 'framer-motion';


function Search() {
    const [values, setValues] = useSearch();

    return (
        <Layout title={"Search Product - Results "} >
            <div className="container">
                <div className="text-center">
                    <h1>Search Results</h1>
                    <h6>{values?.results.length < 1 ? 'No Product Found' : `Found ${values?.results.length}`}</h6>
                    <div className="d-flex flex-wrap gap-4 justify-content-center mb-5">
                        {values?.results.map(p => (
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
            </div>
        </Layout>
    )
}

export default Search;


