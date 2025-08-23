import Product from '../models/productModel.js'; // ✅
const whatsappNumber = '8615669528151'; // your number


export async function getProductDetail(req, res) {
    try {

        const productId = req.params.id;
        const product = await Product.findById(productId).populate('category', 'name');
        if (!product) return res.status(404).send('Product not found');


        // ✅ Only pass the first 4 images
        const images = product.imageUrl && product.imageUrl.length > 4
            ? product.imageUrl.slice(0, 4)
            : product.imageUrl;

        // Replace product.images with limited version
        product.imageUrl = images;

        const message = encodeURIComponent(`I want to know more about ${product.productName}`);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

        // Fetch other products from the same category, excluding the current product
        const recommendations = await Product.find({
            category: product.category._id,
            _id: { $ne: product._id }
        })
            .limit(4) // or whatever number you want to show
            .lean();

        const processedKeywords = product.keywords ? product.keywords.slice(0, 20) : [];

        console.log('Product minQty:', product.minQty);


        res.render('user/product-details', { product, recommendations, whatsappLink, processedKeywords });
    } catch (error) {
        res.status(500).send('Server error');
    }
}



export async function uploadProduct(req, res) {
    try {
        const { productName, description, price, tags, trending, special, handpicked, category, minQty, keywordsKeys = [],   // Expect arrays of keys and values
            keywordsValues = [] } = req.body;
        // Safely parse tags whether it's a string or array
        let tagsArr = [];
        if (Array.isArray(tags)) {
            tagsArr = tags;
        } else if (typeof tags === "string") {
            tagsArr = tags.split(",").map(tag => tag.trim()).filter(Boolean);
        }

        // Process keywords to array of objects
        // Convert non-array inputs into arrays for consistency
        let keysArr = Array.isArray(keywordsKeys) ? keywordsKeys : [keywordsKeys];
        let valuesArr = Array.isArray(keywordsValues) ? keywordsValues : [keywordsValues];
        let keywordsArr = [];
        for (let i = 0; i < keysArr.length; i++) {
            if (keysArr[i] && valuesArr[i]) {
                keywordsArr.push({ key: keysArr[i].trim(), value: valuesArr[i].trim() });
            }
        }

        // Get Multer-uploaded image links from req.files
        // Cloudinary Multer stores the uploaded file URL in req.files[n].path
        const images = req.files && req.files.length ? req.files.map(file => file.path) : [];


        if (!images.length) {
            return res.status(400).json({ error: "At least one product image is required" });
        }


        // Create new product document
        const newProduct = new Product({
            productName,
            description,
            category,
            price,
            minQty: Number(minQty) || 1,
            tags: tagsArr, // assign processed tags array here
            trending: trending === "true" || trending === true,
            special: special === "true" || special === true,
            handpicked: handpicked === "true" || handpicked === true,
            imageUrl: images, // Save array of image URLs
            keywords: keywordsArr,
        });

        await newProduct.save();
        res.redirect('/admin/manage-products');
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Server error while uploading product" });
    }
}

export async function getAllProducts(req, res) {
    try {
        // Handpicked products (random 4)
        const handpickedProducts = await Product.aggregate([
            { $match: { handpicked: true } },
            { $sample: { size: 4 } }
        ]);
        const populatedHandpicked = await Product.populate(handpickedProducts, { path: 'category', select: 'name' });

        // Special products (random 4)
        const specialProducts = await Product.aggregate([
            { $match: { special: true } },
            { $sample: { size: 4 } }
        ]);
        const populatedSpecial = await Product.populate(specialProducts, { path: 'category', select: 'name' });

        // Trending products (random 4)
        const trendingProducts = await Product.aggregate([
            { $match: { trending: true } },
            { $sample: { size: 4 } }
        ]);
        const populatedTrending = await Product.populate(trendingProducts, { path: 'category', select: 'name' });

        // All products
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        // Render page
        res.render('index', {
            products,
            handpickedProducts: populatedHandpicked,
            specialProducts: populatedSpecial,
            trendingProducts: populatedTrending
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server error');
    }
}


export async function manageProducts(req, res) {
    const products = await Product.find().populate('category', 'name').sort({ productName: 1 });
    res.render('admin/manage-products', { products });
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        if (deleted) {
            res.json({ status: 'success', message: 'Product deleted.' });
        } else {
            res.json({ status: 'error', message: 'Product not found.' });
        }
    } catch (error) {
        res.json({ status: 'error', message: 'Could not delete product.' });
    }
}

export async function renderEditProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.render('admin/edit-product', { product });
    } catch (error) {
        res.status(500).send('Server error.');
    }
}

export async function postEditProduct(req, res) {
    try {
        const { productName, price } = req.body;
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { productName, price },
            { new: true }
        );
        if (!updated) return res.status(404).send('Product not found');
        res.redirect('/admin/manage-products');
    } catch (error) {
        res.status(500).send('Server error.');
    }
}

export async function getHandpickedProducts(req, res) {
    try {
        const handpickedProducts = await Product.find({ handpicked: true })
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        console.log('Handpicked products:', handpickedProducts);

        const specialProducts = await Product.find({ special: true })
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.render('index', { handpickedProducts, title: 'Handpicked Products' });
    } catch (error) {
        console.error('Error fetching handpicked products:', error);
        res.status(500).send('Server error');
    }
}


