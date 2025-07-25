import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// create controller
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: 'Name is required' });
        }
        // existing category 
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({ success: true, message: "Category Already Exists" });
        }
        // create new category
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({ success: true, message: 'New category created', category });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in category', error });
    }
}

// update category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        res.status(200).send({ success: true, message: 'Category Updated Successfully', category });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}

// Category controller  for all category list 
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        return res.status(200).send({ success: true, message: "All Category List ", category });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}

// Single Category list
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        res.status(200).send({ success: true, message: 'Get single category successfully', category })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}

// Delete category controller 
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}


