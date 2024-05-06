const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_SECRET;

exports.token_generation = async (user_id,name,userType,gym_id,gym_name) => {
    const token = jwt.sign({ user_id: user_id,name:name,role: userType,gym_id: gym_id,gym_name: gym_name }, secretKey);
    return token;
}

exports.jwt_verify = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        console.log(user)
        next();
    });
};

exports.isClient = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);

        if (user.role !== 'client') {
            return res.status(403).send('Access Denied. Not a client.');
        }
        req.user = user;
        next();
    });
};

exports.isUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);

        if (user.role !== 'user') {
            return res.status(403).send('Access Denied. Not a user.');
        }

        req.user = user;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);

        if (user.role !== 'admin') {
            return res.status(403).send('Access Denied. Not an admin.');
        }

        req.user = user;
        next();
    });
};
