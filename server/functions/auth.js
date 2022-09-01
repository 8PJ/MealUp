module.exports = {
    // check if user is logged in (middleware)
    checkAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.status(401).json({ message: "You are not logged in." });
            return;
        }
        return next();
    },

    // check if user is an admin (middleware)
    checkAdmin: (req, res, next) => {
        if (!req.user.isAdmin) {
            res.status(403).json({ message: "Unauthorised" });
            return;
        }
        return next();
    }
};