const db = require("../db");

module.exports = {
    // checks if all items are defined and not null
    isDefined: (...items) => {
        for (let item in items) {
            if (item === null || item === undefined) {
                return false;
            }
        }
        return true;
    },

    // checks if a database query returns a non result
    existsInDB: async (queryString, params) => {
        try {
            const result = await db.query(queryString, params);

            return result.rowCount !== 0;
        } catch (error) {
            throw (error);
        }
    }
};