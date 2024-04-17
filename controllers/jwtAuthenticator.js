const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_SECRET;

exports.token_generation = (user_id,name,userType) => {
    const token = jwt.sign({ id: user_id,name:name,role: userType }, secretKey);
    return token;
}