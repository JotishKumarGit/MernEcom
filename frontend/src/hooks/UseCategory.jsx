import { useState, useEffect } from "react";
import axios from 'axios';

export default function UseCategory() {
    const [categories, setCategories] = useState([]);

    // get category
    const getCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category');
            setCategories(data?.category);
            console.log(data?.category);
        } catch (error) {
            console.log(error);
        }
    }

    // call get category
    useEffect(() => {
        getCategories();
    }, []);

    return categories;

}