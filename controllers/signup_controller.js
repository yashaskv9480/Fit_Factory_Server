const db = require('../db/DBConfig')
const firebase_controller = require('./firebase/firebase_controller')

async function userSignup(name, email, password, mobile, roleId) {
    const userQuery = "INSERT INTO user_details(name, email, password, mobile) VALUES ($1, $2, $3, $4) RETURNING user_id";
    const userValues = [name, email, password, mobile];
    const userResult = await db.query(userQuery, userValues);
    const user_id = userResult.rows[0].user_id;

    const roleQuery = "INSERT INTO user_role_management(user_id, role_id) VALUES ($1, $2)";
    const roleValues = [user_id, roleId];
    await db.query(roleQuery, roleValues);

    return user_id;
}

exports.user_signup = async (req, res) => {
    try{
    const {name,email,password,mobile} = req.body;
    await userSignup(name,email,password,mobile,2);
    res.status(200).send("User added sucessfully")
    }
    catch(err) {
        res.status(500).send("Contact admin")
    }
}


exports.client_signup = async(req,res) => {
    try{
    const {name,email,password,mobile} = req.body;
    const user_id = await userSignup(name,email,password,mobile,3);
    const {gym_name,gym_image,description,location,address,timings} = req.body;
    const gymQuery = "Insert into gym_details(user_id,gym_name,gym_image,description,location,address,timings) values ($1,$2,$3,$4,$5,$6,$7)"
    const gymValues = [user_id,gym_name,gym_image,description,location,address,timings]
    const gymResult = await db.query(gymQuery,gymValues);
    const imageBuffer = req.file.buffer;
    const imageName = req.file.originalname;
    firebase_controller.upload_image(imageBuffer,imageName);
    res.status(200).send("Sucessfully Added")
    }
    catch(err){
        console.log(err)
        res.status(404).send("Contact admin")
    }
}

