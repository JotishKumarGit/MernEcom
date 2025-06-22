import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
const { Option } = Select;
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProduct() {

    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [photo, setPhoto] = useState('');
    const [shipping, setShipping] = useState('');
    const [id, setId] = useState("");


    // get single products
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            if (data?.product) {
                console.log(data);
                setId(data.product._id);
                setName(data.product.name);
                setDescription(data.product.description);
                setPrice(data.product.price);
                setPhoto(data.product.photo);
                setQuantity(data.product.quantity);
                setShipping(data.product.shipping);
                setCategory(data.product.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error in getting single products ")
        }
    }

    // call single product 
    useEffect(() => {
        getSingleProduct();
        // eslint-disable-next-line
    }, []);

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
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("category", category._id || category);
            photo && productData.append("photo", photo);
            productData.append("shipping", shipping);
            const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData);
            if (data?.success) {
                toast.success("Product Updated Successfully");
                navigate('/dashboard/admin/products');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error in creating product");
        }
    }

    // handle delete 
    const handleDelete = async () => {
        try {
            let answer = window.confirm("Are you sure want to delete this product ?");
            if (!answer) return;
            const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
            toast.success("Product Deleted Successfully");
            console.log("Product is deleted");
            navigate('/dashboard/admin/products');
        } catch (error) {
            console.log(error);
            toast.error("Error in delete");
        }
    }


    return (
        <Layout title={'Dashboard - Update Product'}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select variant='borderless' placeholder="Select a category" size='large' showSearch className='form-select mb-3' onChange={(value) => setCategory(value)} value={category.name} >
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
                                {photo ? (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt="product_photo" height="200px" className='img img-responsive' />
                                    </div>
                                ) :
                                    <div className='text-center'>
                                        <img src={`/api/v1/product/product-photo/${id}`} alt="product_photo" height="200px" className='img img-responsive' />
                                    </div>
                                }
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
                                <Select variant='borderless' placeholder='Select Shipping' size='large' showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }} value={shipping ? "Yes" : "No"} >
                                    <Option value='0' >No</Option>
                                    <Option value='1' >Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3 text-end">
                                <button className='btn btn-primary ' onClick={handleUpdate}>Update Product</button>
                            </div>
                            <div className="mb-3 text-end">
                                <button className='btn btn-danger ' onClick={handleDelete}>Delete Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct