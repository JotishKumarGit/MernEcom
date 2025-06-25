import slugify from 'slugify';
import productModel from '../models/productModel.js';
import fs from 'fs';
import categoryModel from '../models/categoryModel.js';
import braintree from 'braintree';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv';
dotenv.config();

// payment gateway 
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


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
                return res.status(400).send({ error: 'Name is required' });
            case !description:
                return res.status(400).send({ error: 'Description is required' });
            case !price:
                return res.status(400).send({ error: 'Price is required' });
            case !category:
                return res.status(400).send({ error: 'Category is required' });
            case !quantity:
                return res.status(400).send({ error: 'Quantity is required' });
            case photo && photo.size > 100000:
                return res.status(400).send({ error: 'Photo is required should be less then 1mb' });
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

// filter controller 
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) {
            args.category = checked;
        }
        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] };
            const products = await productModel.find(args);
            res.status(200).send({ success: true, message: 'Filter checked successfully', products })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}

// product controller 
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({ success: true, message: 'Product count successfully', total });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
}

// Product list based on page 

export const productListController = async (req, res) => {
    try {
        const perPage = 3;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({ success: true, products });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
}

// Search Product controller 
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");
        res.status(200).send({ success: true, result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error', error })
    }
}


// relative product controller 
export const relativeProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-photo').limit(3).populate("category");
        res.status(200).send({ success: true, products })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error', error })
    }
}

// get product by category

export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate('category');
        res.status(200).send({ success: true, category, products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}


// payment gateway api 
// token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// payments 

export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};