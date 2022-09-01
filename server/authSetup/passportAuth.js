const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("../db");

// strategy for authentication
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const result = await db.query(
            "SELECT * FROM app_user WHERE username=$1",
            [username]
        );

        // if no user was found
        if (result.rows.length == 0) {
            return done(null, false, { message: "Incorrect username or password." });
        }

        const hash = result.rows[0].password;
        const match = await bcrypt.compare(password, hash);

        // if passwords match
        if (match) {
            return done(null, result.rows[0]);
        }
        else {
            return done(null, false, { message: "Incorrect username or password." });
        }

    } catch (error) {
        console.log(error);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    return done(null, { userID: user.user_id, username: user.username, email: user.email, isAdmin: user.is_admin });
});

passport.deserializeUser((user, done) => {
    return done(null, user);
});

module.exports = passport;