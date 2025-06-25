import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useAuth } from '../../Context/Auth';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import SearchInput from '../Form/SearchInput';
import UseCategory from '../../hooks/UseCategory';
import { useCart } from '../../Context/Cart';
import { Badge } from 'antd';

function Header() {
    const [auth, setAuth] = useAuth();
    const categories = UseCategory();
    const [cart, setCart] = useCart();

    const handleLogout = () => {
        setAuth({ ...auth, user: null, token: "" });
        localStorage.removeItem("auth");
        toast.success("Logout Successfully");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-5" >
                <div className="container-fluid">
                    <Link to='/' className="navbar-brand">
                        <AiOutlineShoppingCart /> E-Commerce App
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        {/* Centered Search Box (Large screens only) */}
                        <div className="mx-auto d-none d-lg-block" style={{ maxWidth: "500px", width: "100%" }}>
                            <SearchInput />
                        </div>

                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">

                            {/* Search Box for Small Screens */}
                            <li className="nav-item d-lg-none w-100 mb-2">
                                <SearchInput />
                            </li>

                            <li className="nav-item">
                                <NavLink to='/' className="nav-link">Home</NavLink>
                            </li>

                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="/categories" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className='dropdown-item' to={'/categories'} >All Categories</Link>
                                    </li>
                                    {categories && categories.map(c => (
                                        <li key={c._id}>
                                            <Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {!auth.user ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink to='/register' className="nav-link">Register</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to='/login' className="nav-link">Login</NavLink>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item dropdown">
                                    <NavLink to='' className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {auth?.user?.name}
                                    </NavLink>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li>
                                            <NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">Dashboard</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='/login' onClick={handleLogout} className="dropdown-item">Logout</NavLink>
                                        </li>
                                    </ul>
                                </li>
                            )}

                            <li className="nav-item">
                                <Badge>
                                    <Badge count={cart?.length} showZero>
                                        <NavLink to='/cart' className="nav-link">
                                           Cart
                                        </NavLink>
                                    </Badge>
                                </Badge>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
