const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const db = require('../db/DBConfig')
const user_Details = require('./userDetails')
const jwtTokenGeneration = require('./jwtAuthenticator')
dotenv.config()

exports.user_login =  async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await db.query("SELECT user_id,name FROM user_details WHERE email=($1) AND password=($2)", [email, password]);
        const user = userDetails.rows[0];
        if (user) {
                const userRole = await user_Details.checkuserRole(user.user_id)
                const token = await jwtTokenGeneration.token_generation(user.user_id,user.name,userRole)
                const responseObj = {
                "token": token,
            };
            return res.status(200).json(responseObj);
        }
        return res.status(404).json({ "message": 404 });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
  };