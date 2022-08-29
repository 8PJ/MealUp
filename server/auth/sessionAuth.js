const session = require("express-session");
const passport = require("./passportAuth");
const pgSession = require("connect-pg-simple")(session);
const db = require("../db");

module.exports = (app) => {
    app.use(session({
        store: new pgSession({
            pool: db,
            tableName: "session",
            ttl: 86400 // 24 hours
        }),
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 86400000, sameSite: true }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
};

