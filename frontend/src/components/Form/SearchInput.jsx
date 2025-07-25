import React, { useState } from 'react';
import { useSearch } from '../../Context/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function SearchInput() {

    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    // handle submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
            setValues({ ...values, results: data.result });
            navigate('/search');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="container-fluid">
                <form className="d-flex" onSubmit={handleSubmit}>
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={values.keyword} onChange={(e) => setValues({ ...values, keyword: e.target.value })} />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </>
    )
}

export default SearchInput;


