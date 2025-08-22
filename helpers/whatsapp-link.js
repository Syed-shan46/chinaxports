const whatsappNumber = '919747304599'; // your number
const message = encodeURIComponent(`I want to know more about ${product.productName}`);

const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

res.render('user/product-details', { product, whatsappLink });
