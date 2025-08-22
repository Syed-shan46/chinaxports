module.exports = function (req, res, next) {
    if (req.session && req.session.adminAuthenticated) {
        // Already passed password, allow access
        return next();
    }

    // If accessing password entry page or POST submission, allow
    if (
        req.path === '/admin-password' ||
        (req.path === '/admin-password-submit' && req.method === 'POST')
    ) {
        return next();
    }

    // ❌ Wrong: relative path caused endless /admin/admin/... loop
    // res.redirect('admin/admin-password');

    // ✅ Correct: always redirect to absolute path
    res.redirect('/admin/admin-password');
};
