import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
const { Option } = Select;
import { useNavigate } from 'react-router-dom';

function CreateProduct() {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [photo, setPhoto] = useState('');
    const [shipping, setShipping] = useState('');
    const navigate = useNavigate();

    // Get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error in get all category");
        }
    }

    useEffect(() => {
        getAllCategory();
    }, [])

    // create product
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("category", category);
            productData.append("photo", photo);
            productData.append("shipping", shipping);
            const { data } = await axios.post('/api/v1/product/create-product', productData);
            if (data?.success) {
                toast.success("Product Created Successfully");
                navigate('/dashboard/admin/products');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error in creating product");
        }

    }

    return (
        <Layout title={"Dashboard - Products"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>
                        <div className="m-1 w-75">
                            <Select variant='borderless' placeholder="Select a category" size='large' showSearch className='form-select mb-3' onChange={(value) => setCategory(value)}  >
                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id} >{c.name}</Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className='btn btn-outline-secondary col-md-12' >
                                    {photo ? photo.name : "Upload photo"}
                                    <input type="file" name='' id='' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className="mb-3">
                                <input type="text" value={name} placeholder='Enter product name' className='form-control' onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <textarea name="" id="" value={description} placeholder='Enter product description' className='form-control' onChange={(e) => setDescription(e.target.value)}> </textarea>
                            </div>

                            <div className="mb-3">
                                <input type="number" value={price} placeholder='Enter product price' className='form-control' onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" value={quantity} placeholder='Enter product quantity' className='form-control' onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <Select variant='borderless' placeholder='Select Shipping' size='large' showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }} >
                                    <Option value='0' >No</Option>
                                    <Option value='1' >Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3 text-end">
                                <button className='btn btn-primary ' onClick={handleCreate}>Create Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct;

