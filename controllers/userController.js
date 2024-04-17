const db = require('../db/DBConfig')

exports.viewusers = async(req, res) => {
    try {
        const allusers = await db.query(
            'SELECT * FROM user_details'
        );
        res.json(allusers.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
}

