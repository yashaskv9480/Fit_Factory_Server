const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const db = require('../db/DBConfig')
dotenv.config()

exports.user_login =  async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password)
        const result = await db.query("SELECT uid,name FROM user_details WHERE email=($1) AND password=($2)", [email, password]);
        const user = result.rows[0];
        console.log(user)
        if (user) {
                const result2 = await db.query("SELECT role FROM user_role_management WHERE uid = $1", [user.uid]);
                userType = result2.rows[0].role;
                const token = jwt.sign({ id: user.uid,name:user.name,role: userType }, secretKey);
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