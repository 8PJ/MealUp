module.exports = {
    // check if user is logged in, send 403 if user not logged in
    checkAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.status(403).json({ message: "You are not logged in." });
            return;
        }
        return next();
    }
};