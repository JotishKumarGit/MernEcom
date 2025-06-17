import slugify from 'slugify';
import productModel from '../models/productModel.js';
import fs from 'fs';

export const createController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        // validations 
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'Description is required' });
            case !price:
                return res.status(500).send({ error: 'Price is required' });
            case !category:
                return res.status(500).send({ error: 'Category is required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });
            case !photo && photo.size > 100000:
                return res.status(500).send({ error: 'Photo is required should be less then 1mb' });
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({ success: true, message: 'Product created successfully ', products });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}

// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({ success: true, totalCount: products.length, message: 'All Products', products });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Error in get al products', error })
    }
}

// get Single Product Controller

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select('-photo').populate('category');
        res.status(200).send({ success: true, message: 'Single product fetched', product });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Error in get single products', error });
    }
}

// Product photo controller
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Error in product photo ', error });
    }
}

// delete product controller 
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Error in delete product', error })
    }
}

// update product 
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        // validations 
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'Description is required' });
            case !price:
                return res.status(500).send({ error: 'Price is required' });
            case !category:
                return res.status(500).send({ error: 'Category is required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });
            case !photo && photo.size > 100000:
                return res.status(500).send({ error: 'Photo is required should be less then 1mb' });
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, { name, slug, description, price, category, quantity, shipping, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({ success: true, message: 'Product updated successfully ', products });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Error in update product', error });
    }
}

