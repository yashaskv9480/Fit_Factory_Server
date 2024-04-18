const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_SECRET;

exports.token_generation = async (user_id,name,userType) => {
    const token = jwt.sign({ id: user_id,name:name,role: userType }, secretKey);
    return token;
}

exports.jwt_verify = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        return res.status(200).send("Sucessfull")
    });
};