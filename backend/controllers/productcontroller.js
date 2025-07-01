const Products = require("../models/Products");

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        if(!products || products.length === 0) {
            return res.status(204).json({"message": "No products found"});
        }
        return res.json(products || []);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

// Get all men's products
const getAllMen = async (req, res) => {
    try {
        const menProducts = await Products.find({ category: 'men' });
        if(!menProducts || menProducts.length === 0) {
            return res.status(204).json({"message": "No men's products found"});
        }
        return res.json(menProducts || []);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

// Get all women's products
const getAllWomen = async (req, res) => {
    try {
        const womenProducts = await Products.find({ category: 'women' });
        if(!womenProducts || womenProducts.length === 0) {
            return res.status(204).json({"message": "No women's products found"});
        }
        return res.json(womenProducts || []);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllProducts,
    getAllMen,
    getAllWomen
};