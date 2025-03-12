const Category = require('../models/category');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Middleware to find category by ID
exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id).exec();
        if (!category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Category does not exist'
        });
    }
};

// Create category
exports.create = async (req, res) => {
    const category = new Category(req.body);
    try {
        const data = await category.save();
        res.json({ data });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

// Read category
exports.read = (req, res) => {
    return res.json(req.category);
};

exports.update = async (req, res) => {
    try {
        const category = req.category;
        category.name = req.body.name;

        const data = await category.save();
        res.json(data);
    } catch (err) {
        res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const category = req.category;

        // Ensure category exists
        if (!category) {
            return res.status(400).json({
                message: 'Category not found'
            });
        }

        // Fetch associated products
        const products = await Product.find({ category: category._id }).exec();

        // Check if products are associated with the category
        if (products.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You can't delete ${category.name}. It has ${products.length} associated products.`
            });
        }

        // Remove the category using deleteOne or findByIdAndDelete
        await Category.findByIdAndDelete(category._id);
        
        res.json({
            message: 'Category deleted'
        });

    } catch (err) {
        // Log error and respond with error handler
        console.error('Error deleting category:', err);
        res.status(400).json({
            error: errorHandler(err)
        });
    }
};


exports.list = async (req, res) => {
    try {
        const data = await Category.find().exec();
        res.json(data);
    } catch (err) {
        res.status(400).json({
            error: errorHandler(err)
        });
    }
};
