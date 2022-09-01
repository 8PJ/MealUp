module.exports = {
    handleReqestSyntaxError: (error, req, res, next) => {
        if (error instanceof SyntaxError && error.status === 400) {
            console.log(error);
            res.status(400).json({ message: "Request may have a syntax error." });
            return;
        }
        return next();
    }
};