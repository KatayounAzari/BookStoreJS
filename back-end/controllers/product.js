const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).populate('category').exec();
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }
        req.product = product;
        next();
    } catch (err) {
        return res.status(400).json({ error: 'Product not found' });
    }
};

exports.read = (req, res) => {
    req.product.image = undefined;
    return res.json(req.product);
};

exports.create = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // Extracting fields
        let { name, description, price, category, quantity, shipping } = fields;

        // Cast fields to their respective types
        name = String(name);
        description = String(description);
        price = Number(price);
        category = String(category);
        quantity = Number(quantity);
        shipping = shipping === 'true'; // Convert string 'true'/'false' to Boolean

        // Validate required fields
        if (!name || !description || !price || !category || !quantity || shipping === undefined) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Create new product object with parsed fields
        let product = new Product({ name, description, price, category, quantity, shipping });

        // Check for image upload
        if (files.image) {
            if (files.image.size > 1000000) {  // Limit to 1MB
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            
            try {
                product.image.data = fs.readFileSync(files.image.path);
            } catch (err) {
                console.error('File read error: ', err);
                return res.status(400).json({
                    error: 'Error reading image file'
                });
            }
            product.image.contentType = files.image.type;
        }

        try {
            const result = await product.save();
            res.json(result);
        } catch (err) {
            console.log('PRODUCT CREATE ERROR ', err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
    });
};

exports.remove = async (req, res) => {
    let product = req.product;
    try {
        const deletedProduct = await product.deleteOne();
        res.json({
            message: 'Product deleted successfully'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.update = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Image could not be uploaded' });
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (files.image) {
            if (files.image.size > 1000000) {
                return res.status(400).json({ error: 'Image should be less than 1mb in size' });
            }
            product.image.data = fs.readFileSync(files.image.path);
            product.image.contentType = files.image.type;
        }

        try {
            const result = await product.save();
            res.json(result);
        } catch (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
    });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */
exports.list = async (req, res) => {
    try {
        const order = req.query.order || 'asc';
        const sortBy = req.query.sortBy || '_id';
        const limit = req.query.limit ? parseInt(req.query.limit) : 1;

        const products = await Product.find()
            .select('-image')
            .populate('category')
            .sort([[sortBy, order]])
            .limit(limit)
            .exec();

        res.json(products);
    } catch (err) {
        res.status(400).json({ error: 'Products not found' });
    }
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */
exports.listRelated = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 6;

        const products = await Product.find({ _id: { $ne: req.product }, category: req.product.category })
            .limit(limit)
            .populate('category', '_id name')
            .exec();

        res.json(products);
    } catch (err) {
        res.status(400).json({ error: 'Products not found' });
    }
};

exports.listCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category', {});
        res.json(categories);
    } catch (err) {
        res.status(400).json({ error: 'Categories not found' });
    }
};


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
exports.listBySearch = async (req, res) => {
    try {
        const order = req.body.order || 'desc';
        const sortBy = req.body.sortBy || '_id';
        const limit = req.body.limit ? parseInt(req.body.limit) : 100;
        const skip = parseInt(req.body.skip);
        let findArgs = {};

        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === 'price') {
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1]
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }

        const data = await Product.find(findArgs)
            .select('-image')
            .populate('category')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec();

        res.json({ size: data.length, data });
    } catch (err) {
        res.status(400).json({ error: 'Products not found' });
    }
};


exports.image = (req, res, next) => {
    if (req.product.image.data) {
        res.set('Content-Type', req.product.image.contentType);
        return res.send(req.product.image.data);
    }
    next();
};

exports.listSearch = async (req, res) => {
    const query = {};

    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        try {
            const products = await Product.find(query).select('-image').exec();
            res.json(products);
        } catch (err) {
            res.status(400).json({ error: errorHandler(err) });
        }
    }
};

exports.decreaseQuantity = async (req, res, next) => {
    const bulkOps = req.body.order.products.map(item => ({
        updateOne: {
            filter: { _id: item._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } }
        }
    }));

    try {
        await Product.bulkWrite(bulkOps, {});
        next();
    } catch (error) {
        res.status(400).json({ error: 'Could not update product' });
    }
};
