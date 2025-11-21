exports.getCart = (req, res) => {
    const cart = req.session.cart || [];

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);

    // Offer — if above 50,000, apply discount (e.g., 5% or fixed)
    let offerDiscount = subtotal >= 50000 ? Math.round(subtotal * 0.05) : 0;

    const grandTotal = subtotal - offerDiscount;

    // WhatsApp number
    const whatsappNumber = "918593939333";

    // Encode message
    const cartText = cart
        .map(item => `${item.name} (x${item.quantity}) - ₹${item.total}`)
        .join("\n");

    const encodedCartDetails = encodeURIComponent(
        `🛒 *New Order Inquiry*\n\n${cartText}\n\nSubtotal: ₹${subtotal}\nOffer: ₹${offerDiscount}\nTotal: ₹${grandTotal}`
    );

    res.render("user/cart", {
        cart,
        subtotal,
        offerDiscount,
        grandTotal,
        whatsappNumber,
        encodedCartDetails
    });
};


exports.addToCart = (req, res) => {
    const { id, name, price, image } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        req.session.cart.push({
            id,
            name,
            price: Number(price),
            image,
            quantity: 1,
            total: Number(price)
        });
    }

    return res.redirect("/cart");
};


exports.increaseQty = (req, res) => {
    const id = req.params.id;
    const cart = req.session.cart || [];

    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
        item.total = item.quantity * item.price;
    }

    res.redirect("/cart");
};

exports.decreaseQty = (req, res) => {
    const id = req.params.id;
    const cart = req.session.cart || [];

    const item = cart.find(i => i.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            item.total = item.quantity * item.price;
        }
    }

    res.redirect("/cart");
};

exports.removeItem = (req, res) => {
    const id = req.params.id;

    req.session.cart = (req.session.cart || []).filter(i => i.id !== id);

    res.redirect("/cart");
};
