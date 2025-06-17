import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className='footer'>
            <div className=' text-white py-4 text-center fs-4' >All Right Reserved &copy; TechInfo</div>
            <div className="text-center">
                <a to='' >About</a>|
                <a to='/contact' >Contact</a>|
                <a to='/privacy' >Privacy</a>
            </div>
        </div>
    )
}

export default Footer;

