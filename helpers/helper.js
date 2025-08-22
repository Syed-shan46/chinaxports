module.exports = {
    // From first block
    json: function (context) {
        return JSON.stringify(context);
    },
    eq: function (v1, v2) {
        return v1 === v2;
    },
    inc: function (value) {
        return parseInt(value) + 1;
    },
    dec: function (value) {
        return parseInt(value) - 1;
    },
    range: function (n, start) {
        return Array.from({ length: n }, (v, k) => k + start);
    },
    gt: function (a, b) {
        return a > b;
    },
    lt: function (a, b) {
        return a < b;
    },
    formatOrderDate: function (dateString) {
        const dateObj = new Date(dateString);
        return dateObj.toDateString() + ' ' + dateObj.toTimeString().split(' ')[0];
    },

    // From second block
    ifEquals: function (arg1, arg2, options) {
        return (arg1 && arg2 && arg1.toString() === arg2.toString()) ? options.fn(this) : options.inverse(this);
    },
    paginationItems: function (total) {
        let pages = [];
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
        return pages;
    },
    subtract: (a, b) => a - b,
    add: (a, b) => a + b,
    queryString: function (selectedCategory, currentPage) {
        let params = [];
        if (selectedCategory) params.push(`category=${selectedCategory}`);
        if (currentPage) params.push(`page=${currentPage}`);
        return params.join('&');
    }

    
};
