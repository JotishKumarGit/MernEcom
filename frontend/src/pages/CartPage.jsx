import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout';
import { useCart } from '../Context/Cart';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';

function CartPage() {

    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);

    // remove cart item 
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex(item => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.log(error);
        }
    }

    // Total Price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map(item => { total = total + item.price });
            return total.toLocaleString("es-US", {
                style: "currency",
                currency: "USD",
            });
        } catch (error) {
            console.log(error);
        }
    }

    // get payment gateway token
    const getBraintreeToken = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/braintree/token');
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    }

    // Load Braintree Token on component mount
    useEffect(() => {
        getBraintreeToken();
    }, [auth?.token]);

    // Handle Payment
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post("/api/v1/product/braintree/payment", {
                nonce,
                cart,
            });
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment Completed Successfully ");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className='text-center bg-light p-2 mb-1' >{`Hello ${auth?.token && auth?.user?.name}`}</h1>
                        <h4 className="text-center">
                            {cart?.length > 0 ? (auth?.token ? `You Have ${cart.length} items in your cart` : `You Have ${cart.length} items in your cart. Please login to checkout`) : ("Your Cart Is Empty")}
                        </h4>
                    </div>
                </div>
                <div className="row">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        {cart?.map((p, i) => (
                            <div className="card mb-3 shadow-sm cart-item animate__animated animate__fadeInUp" key={i}>
                                <div className="row g-0 align-items-center">
                                    {/* Product Image */}
                                    <div className="col-3 text-center">
                                        <img src={`/api/v1/product/product-photo/${p._id}`} className="img-fluid rounded cart-img py-2" alt={p.name} style={{ maxHeight: '100px', objectFit: 'cover' }} />
                                    </div>
                                    {/* Product Info */}
                                    <div className="col-md-8">
                                        <div className="card-body py-2 px-3">
                                            <h6 className="fw-bold mb-1">{p.name}</h6>
                                            <p className="text-muted small mb-1">{p.description?.slice(0, 60)}...</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-success fw-semibold">₹ {p.price}</span>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => removeCartItem(p._id)}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Checkout Box */}
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 animate__animated animate__fadeInRight">
                            <h4 className="text-center mb-3">🛒 Checkout</h4>
                            <hr />
                            <p className="mb-2">Total Items: <strong>{cart.length}</strong></p>
                            <p className="mb-3">Total Price: <strong>{totalPrice()}</strong></p>
                            {auth?.user?.address ? (<div className='mb-3'>
                                <>
                                    <p>Current Address</p>
                                    <p>{auth?.user?.address}</p>
                                    <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')} >Update Address</button>
                                </>
                            </div>) : (
                                <div>
                                    {
                                        auth?.token ? (
                                            <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                        ) : (
                                            <button className='btn btn-outline-warning mb-3' onClick={() => navigate('/login', { state: '/cart' })}>Please Login To The Checkout</button>
                                        )}
                                </div>
                            )}
                            {/*  */}
                            <div className="mt-2">
                                {!clientToken || !cart?.length ? (
                                    ""
                                ) : (
                                    <>
                                        <DropIn key={clientToken} style={{ maxHeight:'200px', width:'200px' }}
                                            options={{
                                                authorization: clientToken,
                                                paypal: {
                                                    flow: "vault",
                                                },
                                            }}
                                            onInstance={(instance) => setInstance(instance)}
                                        />

                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePayment}
                                            disabled={loading || !instance || !auth?.user?.address}
                                        >
                                            {loading ? "Processing ...." : "Make Payment"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default CartPage;

